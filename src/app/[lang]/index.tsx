import { Redirect, useLocalSearchParams } from 'expo-router'
import MainMenu from '@/novel/components/MainMenu'
import { isLang, LANGUAGES, SOURCE_LANG } from '@/novel/i18n'

export function generateStaticParams (): Record<string, string>[] {
  return LANGUAGES.filter(language => !language.source).map(language => ({ lang: language.code }))
}

export default function LangIndex () {
  const { lang } = useLocalSearchParams<{ lang: string }>()

  if (!isLang(lang) || lang === SOURCE_LANG || !LANGUAGES.some(language => language.code === lang)) {
    return <Redirect href={'/'} />
  }

  return <MainMenu />
}
