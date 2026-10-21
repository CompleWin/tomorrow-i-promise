import { Compiler } from 'inkjs/compiler/Compiler'
import fs from 'node:fs'
import crypto from 'node:crypto'

const BOM = /^\uFEFF/
const ASSETS_DIR = 'public/content/assets'
const BG_DIR = `${ASSETS_DIR}/bg`
const SFX_DIR = `${ASSETS_DIR}/sfx`

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

const sounds = [...text.matchAll(/#\s*sfx:\s*(\S+)/g)].map(sfx => sfx[1])
for (const sfx of sounds) {
  if (!fs.existsSync(`${SFX_DIR}/${sfx}`)) {
    console.error(`sfx does not exist: ${sfx} (expected in ${SFX_DIR})`)
    process.exit(1)
  }
}

const FX = ['fadeIn', 'close', 'blackout', 'lightsOn', 'toBlack', 'shake']
const effects = [...text.matchAll(/#\s*fx:\s*(\S*)/g)].map(fx => fx[1])
for (const fx of effects) {
  if (!FX.includes(fx)) {
    console.error(`unknown fx: ${fx}, expected one of: ${FX.join(', ')}`)
    process.exit(1)
  }
}

const menuArt = JSON.parse(fs.readFileSync('src/novel/menuArt.json', 'utf8'))
const menuFiles = [...Object.values(menuArt.acts), menuArt.completed]
  .flatMap(art => [art.base, art.flicker])
  .filter(path => path !== undefined)
for (const path of menuFiles) {
  if (!fs.existsSync(`${ASSETS_DIR}/${path}`)) {
    console.error(`menu art does not exist: ${path} (src/novel/menuArt.json)`)
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




