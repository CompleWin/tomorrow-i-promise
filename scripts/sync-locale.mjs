import fs from 'node:fs'
import { localePath, parse, readSource, readTable, SOURCE } from './locale.mjs'

const code = process.argv[2]
if (code === undefined || !/^[a-z]{2,3}$/.test(code) || code === SOURCE) {
  console.error(`usage: npm run locale -- <code>, code is not "${SOURCE}"`)
  process.exit(1)
}

const items = parse(readSource())
const table = readTable(code)
const unused = { ...table.unused }
const seen = { speakers: new Set(), lines: new Set() }
const result = { speakers: {}, lines: {} }

function take (section, key) {
  if (key in table[section]) {
    return table[section][key]
  }
  if (`${section}: ${key}` in unused) {
    const value = unused[`${section}: ${key}`]
    delete unused[`${section}: ${key}`]
    return value
  }
  return ''
}

function add (section, knot, key) {
  if (!seen[section].has(key)) {
    seen[section].add(key)
    result[section][key] = take(section, key)
  }
  const override = `${knot}: ${key}`
  if (override in table[section] && !seen[section].has(override)) {
    seen[section].add(override)
    result[section][override] = table[section][override]
  }
}

for (const item of items) {
  if (item.speaker !== null) {
    add('speakers', item.knot, item.speaker)
  }
  if (item.text !== null) {
    add('lines', item.knot, item.text)
  }
}

for (const section of ['speakers', 'lines']) {
  for (const [key, value] of Object.entries(table[section])) {
    if (!seen[section].has(key) && value !== '') {
      unused[`${section}: ${key}`] = value
    }
  }
}

const output = Object.keys(unused).length > 0 ? { ...result, unused } : result
fs.mkdirSync('story/locales', { recursive: true })
fs.writeFileSync(localePath(code), JSON.stringify(output, null, 2) + '\n', 'utf8')

const empty = ['speakers', 'lines'].reduce((sum, section) =>
  sum + Object.values(result[section]).filter(value => value === '').length, 0)
console.log(`${localePath(code)}: ${empty} without translation, ${Object.keys(unused).length} unused`)
