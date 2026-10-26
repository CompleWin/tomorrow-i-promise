import { Compiler } from 'inkjs/compiler/Compiler'
import fs from 'node:fs'
import crypto from 'node:crypto'
import * as fontkit from 'fontkit'
import { LANGUAGES, localePath, parse, readSource, readTable, SOURCE, translate } from './locale.mjs'

const ASSETS_DIR = 'public/content/assets'
const CONTENT_DIR = 'public/content'
const FONT = 'assets/fonts/Galmuri11.ttf'
const I18N_DIR = 'src/novel/i18n'

const text = readSource()

function compile (ink, code) {
  const compiler = new Compiler(ink)
  let story
  try {
    story = compiler.Compile()
  } catch (error) {
    console.error(`${code}:`, compiler.errors.length > 0 ? compiler.errors : error)
    process.exit(1)
  }
  if (compiler.warnings.length > 0) {
    console.error(`${code}:`, compiler.warnings)
    process.exit(1)
  }
  return story.ToJson()
}

function report (title, entries) {
  return [`${title}:`, ...entries.map(entry => `  ${entry}`)].join('\n')
}

const backgrounds = [...text.matchAll(/#\s*bg:\s*([^#\n]+)/g)].flatMap(bg => bg[1].trim().split(/\s+/))
for (const bg of backgrounds) {
  if (!fs.existsSync(`${ASSETS_DIR}/${bg}`)) {
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

const sounds = [...text.matchAll(/#\s*sfx:\s*([^\s#]+)[ \t]*([^\s#]*)/g)]
for (const [, sfx, mode] of sounds) {
  if (sfx !== 'stop' && !fs.existsSync(`${ASSETS_DIR}/${sfx}`)) {
    console.error(`sfx does not exist: ${sfx} (expected in ${ASSETS_DIR}, or use "sfx: stop")`)
    process.exit(1)
  }
  if (sfx === 'stop' && mode !== '' && mode !== 'all') {
    console.error(`unknown sfx stop mode: ${mode}, expected "all" or nothing`)
    process.exit(1)
  }
  if (sfx !== 'stop' && mode !== '' && mode !== 'loop') {
    console.error(`unknown sfx mode: ${mode}, expected "loop" or nothing`)
    process.exit(1)
  }
}

const tracks = [...text.matchAll(/#\s*music:\s*(\S+)/g)].map(music => music[1])
for (const music of tracks) {
  if (music !== 'stop' && !fs.existsSync(`${ASSETS_DIR}/${music}`)) {
    console.error(`music does not exist: ${music} (expected in ${ASSETS_DIR}, or use "music: stop")`)
    process.exit(1)
  }
}

const FX = ['fadeIn', 'close', 'blackout', 'lightsOn', 'move', 'toBlack', 'shake']
const effects = [...text.matchAll(/#\s*fx:\s*(\S*)/g)].map(fx => fx[1])
for (const fx of effects) {
  if (!FX.includes(fx)) {
    console.error(`unknown fx: ${fx}, expected one of: ${FX.join(', ')}`)
    process.exit(1)
  }
}

const waits = [...text.matchAll(/#\s*wait:\s*(\S*)/g)].map(wait => wait[1])
for (const wait of waits) {
  if (!/^\d+$/.test(wait)) {
    console.error(`wait must be milliseconds: ${wait}`)
    process.exit(1)
  }
}

const menuArt = JSON.parse(fs.readFileSync('src/novel/menuArt.json', 'utf8'))
const menuFiles = [...Object.values(menuArt.acts), menuArt.completed]
  .flatMap(art => [art.base, art.flicker])
  .filter(path => path !== undefined)
  .concat(menuArt.music.file)
for (const path of menuFiles) {
  if (!fs.existsSync(`${ASSETS_DIR}/${path}`)) {
    console.error(`menu art does not exist: ${path} (src/novel/menuArt.json)`)
    process.exit(1)
  }
}

const font = fontkit.openSync(FONT)
const fontTexts = [
  ['story/main.ink', text],
  ...LANGUAGES.filter(({ code }) => code !== SOURCE).map(({ code }) => [localePath(code), fs.readFileSync(localePath(code), 'utf8')]),
  ...fs.readdirSync(I18N_DIR).map(name => [`${I18N_DIR}/${name}`, fs.readFileSync(`${I18N_DIR}/${name}`, 'utf8')]),
]
for (const [path, content] of fontTexts) {
  const missing = [...new Set(content.replace(/\s/g, ''))]
    .filter(char => !font.hasGlyphForCodePoint(char.codePointAt(0)))
  if (missing.length > 0) {
    console.error(`${FONT} has no glyphs for ${missing.map(char => `«${char}» U+${char.codePointAt(0).toString(16).toUpperCase()}`).join(', ')} (${path})`)
    process.exit(1)
  }
}

let items
try {
  items = parse(text)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

const stories = {}
const hash = crypto.createHash('sha256')

for (const { code } of LANGUAGES) {
  let ink = text
  if (code !== SOURCE) {
    const result = translate(items, readTable(code))
    if (result.unused.length > 0) {
      console.warn(report(`${localePath(code)}: keys not in the story`, result.unused))
    }
    if (result.invalid.length > 0) {
      console.error(report(`${localePath(code)}: ink syntax in translation`, result.invalid))
      process.exit(1)
    }
    if (result.missing.length > 0) {
      console.error(report(`${localePath(code)}: no translation (npm run locale -- ${code})`, result.missing))
      process.exit(1)
    }
    ink = result.ink
  }
  const file = code === SOURCE ? 'story.json' : `story.${code}.json`
  const json = compile(ink, code)
  fs.writeFileSync(`${CONTENT_DIR}/${file}`, json)
  stories[code] = file
  hash.update(json)
}

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
  'story': stories[SOURCE],
  'stories': stories,
}

fs.writeFileSync(`${CONTENT_DIR}/manifest.json`,
  JSON.stringify(manifestJson, null, 2), 'utf8')

console.log(`story built (${Object.keys(stories).join(', ')}), version: ${version}`)




