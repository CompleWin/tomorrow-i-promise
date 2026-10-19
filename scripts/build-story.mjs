import { Compiler } from 'inkjs/compiler/Compiler'
import fs from 'node:fs'
import crypto from 'node:crypto'

const BOM = /^\uFEFF/
const ASSETS_DIR = 'public/content/assets'
const BG_DIR = `${ASSETS_DIR}/bg`

const textFile = fs.readFileSync('story/main.ink', 'utf8')
const text = textFile.replace(BOM, '')

const compiler = new Compiler(text)

let story
try {
  story = compiler.Compile()
} catch (error) {
  console.error(compiler.errors)
  process.exit(1)
}

if (compiler.warnings.length > 0) {
  console.error(compiler.warnings)
  process.exit(1)
}

const backgrounds = [...text.matchAll(/#\s*bg:\s*(\S+)/g)].map(bg => bg[1])
for (const bg of backgrounds) {
  if (!fs.existsSync(`${BG_DIR}/${bg}`)) {
    console.error(`bg does not exist: ${bg}`)
    process.exit(1)
  }
}

const sprites = [...text.matchAll(/#\s*sprite:\s*(\S+)/g)].map(spr => spr[1])
for (const sprite of sprites) {
  if (!fs.existsSync(`${ASSETS_DIR}/${sprite}`)) {
    console.error(`asset does not exist: ${sprite}`)
    process.exit(1)
  }
}

const json = story.ToJson()
fs.writeFileSync('public/content/story.json', json)

const hash = crypto.createHash('sha256')
hash.update(json)

const assetFiles = fs.readdirSync(ASSETS_DIR, { recursive: true })
  .map(name => name.replaceAll('\\', '/'))
  .filter(name => fs.statSync(`${ASSETS_DIR}/${name}`).isFile())
  .sort()

for (const name of assetFiles) {
  hash.update(name)
  hash.update(fs.readFileSync(`${ASSETS_DIR}/${name}`))
}

const version = hash.digest('hex').slice(0, 8)

const manifestJson = {
  'version': version,
  'story': 'story.json',
}

fs.writeFileSync('public/content/manifest.json',
  JSON.stringify(manifestJson, null, 2), 'utf8')

console.log(`story built, version: ${version}`)




