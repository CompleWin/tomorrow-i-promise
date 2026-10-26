import languages from '@/novel/i18n/languages.json'
import ru from '@/novel/i18n/ru'
import en from '@/novel/i18n/en'

export const STRINGS = { ru, en }

export type Lang = keyof typeof STRINGS

type Language = {
  code: Lang
  name: string
  source?: boolean
}

export function isLang (code: unknown): code is Lang {
  return typeof code === 'string' && Object.hasOwn(STRINGS, code)
}

export const LANGUAGES: Language[] = languages.filter((language): language is Language => isLang(language.code))

export const SOURCE_LANG: Lang = LANGUAGES.find(language => language.source)?.code ?? 'ru'

export function langPath (lang: Lang): string {
  return lang === SOURCE_LANG ? '/' : `/${lang}`
}

export function routeLang (pathname: string): Lang | null {
  if (pathname === '/' || pathname === '') {
    return SOURCE_LANG
  }
  const code = /^\/([^/]+)\/?$/.exec(pathname)?.[1]
  return isLang(code) && code !== SOURCE_LANG && LANGUAGES.some(language => language.code === code) ? code : null
}
