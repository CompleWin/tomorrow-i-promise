import fs from 'node:fs'

const BOM = /^﻿/
const KNOT = /^===\s*(\w+)\s*===$/
const STRUCTURE = /^(===|->|~|VAR\s|\{""\})/
const CHOICE = /^(\s*\*\s*\[)([^\]]*)(\])(.*)$/
const SPEAKER = /(#\s*speaker:\s*)([^#]*?)(\s*)(?=#|$)/
const UNSUPPORTED = /<>|->|\/\/|\/\*|[{}[\]|]|^\s*[-+*=~]/
const FORBIDDEN = /<>|->|\/\/|\/\*|[#{}[\]|\\\n]/

export const LANGUAGES = JSON.parse(fs.readFileSync('src/novel/i18n/languages.json', 'utf8'))
export const SOURCE = LANGUAGES.find(language => language.source).code

export function localePath (code) {
  return `story/locales/${code}.json`
}

export function readSource () {
  return fs.readFileSync('story/main.ink', 'utf8').replace(BOM, '')
}

export function readTable (code) {
  const path = localePath(code)
  if (!fs.existsSync(path)) {
    return { speakers: {}, lines: {} }
  }
  const table = JSON.parse(fs.readFileSync(path, 'utf8').replace(BOM, ''))
  return { ...table, speakers: table.speakers ?? {}, lines: table.lines ?? {} }
}

export function quote (knot, text) {
  return `${knot}: «${text}»`
}

export function parse (source) {
  let knot = '(top)'
  return source.split(/\r?\n/).map(line => {
    const trimmed = line.trim()
    const knotMatch = KNOT.exec(trimmed)
    if (knotMatch !== null) {
      knot = knotMatch[1]
    }
    const hash = line.indexOf('#')
    const body = hash === -1 ? line : line.slice(0, hash)
    const tags = hash === -1 ? '' : line.slice(hash)
    const speakerMatch = SPEAKER.exec(tags)
    const item = {
      knot,
      line,
      text: null,
      speaker: speakerMatch === null ? null : speakerMatch[2].trim(),
      render: (text, speaker) => line,
    }

    if (trimmed === '' || STRUCTURE.test(trimmed)) {
      return item
    }

    const withSpeaker = (speaker) => speaker === null ? tags : tags.replace(SPEAKER, `$1${speaker}$3`)

    if (body.trim() === '') {
      return { ...item, render: (text, speaker) => body + withSpeaker(speaker) }
    }

    const choice = CHOICE.exec(body)
    if (choice !== null) {
      if (choice[4].trim() !== '') {
        throw new Error(`unsupported ink syntax for translation: ${quote(knot, trimmed)}`)
      }
      return {
        ...item,
        text: choice[2].trim(),
        render: (text, speaker) => `${choice[1]}${text}${choice[3]}${choice[4]}${withSpeaker(speaker)}`,
      }
    }

    if (UNSUPPORTED.test(body)) {
      throw new Error(`unsupported ink syntax for translation: ${quote(knot, trimmed)}`)
    }

    const lead = /^\s*/.exec(body)[0]
    const tail = /\s*$/.exec(body)[0]
    return {
      ...item,
      text: body.trim(),
      render: (text, speaker) => `${lead}${text}${tail}${withSpeaker(speaker)}`,
    }
  })
}

export function translate (items, table) {
  const missing = []
  const invalid = []
  const used = { speakers: new Set(), lines: new Set() }

  function find (section, knot, key) {
    for (const candidate of [`${knot}: ${key}`, key]) {
      const value = table[section][candidate]
      if (typeof value === 'string' && value.trim() !== '') {
        used[section].add(candidate)
        if (FORBIDDEN.test(value)) {
          invalid.push(`${quote(knot, key)} → «${value}»`)
        }
        return value.trim()
      }
      if (candidate in table[section]) {
        used[section].add(candidate)
      }
    }
    missing.push(section === 'speakers' ? `${knot}: speaker «${key}»` : quote(knot, key))
    return key
  }

  const ink = items.map(item => {
    if (item.text === null && item.speaker === null) {
      return item.line
    }
    const text = item.text === null ? null : find('lines', item.knot, item.text)
    const speaker = item.speaker === null ? null : find('speakers', item.knot, item.speaker)
    return item.render(text, speaker)
  }).join('\n')

  const unused = ['speakers', 'lines'].flatMap(section =>
    Object.keys(table[section]).filter(key => !used[section].has(key)).map(key => `${section}: «${key}»`))

  return { ink, missing: [...new Set(missing)], invalid, unused }
}
