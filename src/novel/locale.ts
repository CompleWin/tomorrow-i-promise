import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { Platform } from 'react-native'
import { isLang, Lang, LANGUAGES, SOURCE_LANG } from '@/novel/i18n'

const LANG_KEY = 'tomorrow-i-promise.lang'
const NEAR_SOURCE = ['uk', 'be', 'kk']
const FALLBACK: Lang = isLang('en') ? 'en' : SOURCE_LANG
const BOT = /bot|crawl|spider|slurp|lighthouse|headless|preview/i

export async function loadLang (): Promise<Lang | null> {
  try {
    const lang = await AsyncStorage.getItem(LANG_KEY)
    return isLang(lang) && LANGUAGES.some(language => language.code === lang) ? lang : null
  } catch (error) {
    console.warn('loadLang failed', error)
    return null
  }
}

export async function writeLang (lang: Lang): Promise<void> {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang)
  } catch (error) {
    console.warn('writeLang failed', error)
  }
}

export function deviceLang (): Lang {
  const locales = getLocales()
  for (const locale of locales) {
    const code = locale.languageCode
    if (isLang(code) && LANGUAGES.some(language => language.code === code)) {
      return code
    }
  }
  return NEAR_SOURCE.includes(locales[0]?.languageCode ?? '') ? SOURCE_LANG : FALLBACK
}

export function isBot (): boolean {
  return Platform.OS === 'web' && BOT.test(navigator.userAgent)
}
