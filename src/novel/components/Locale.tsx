import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Platform } from 'react-native'
import { usePathname } from 'expo-router'
import { Lang, routeLang, STRINGS } from '@/novel/i18n'
import type { Strings } from '@/novel/i18n/ru'
import { deviceLang, isBot, loadLang, writeLang } from '@/novel/locale'

type Locale = {
  lang: Lang
  t: Strings
  suggested: Lang | null
  setLang: (lang: Lang) => void
  dismissSuggestion: () => void
}

const LocaleContext = createContext<Locale | null>(null)

export function useLocale (): Locale {
  const locale = useContext(LocaleContext)
  if (locale === null) {
    throw new Error('useLocale outside LocaleProvider')
  }
  return locale
}

export function LocaleProvider ({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const fromRoute = Platform.OS === 'web' ? routeLang(pathname) : null
  const [stored, setStored] = useState<Lang | null>(null)
  const [suggested, setSuggested] = useState<Lang | null>(null)
  const lang = fromRoute ?? stored

  useEffect(() => {
    let cancelled = false
    loadLang().then(saved => {
      if (cancelled) {
        return
      }
      if (fromRoute === null) {
        setStored(current => current ?? saved ?? deviceLang())
        return
      }
      if (saved === null && !isBot()) {
        const device = deviceLang()
        setSuggested(device === fromRoute ? null : device)
      }
      if (saved !== fromRoute) {
        writeLang(fromRoute)
      }
      setStored(fromRoute)
    })
    return () => { cancelled = true }
  }, [fromRoute])

  if (lang === null) {
    return null
  }

  const locale: Locale = {
    lang,
    t: STRINGS[lang],
    suggested,
    setLang: next => {
      setStored(next)
      setSuggested(null)
      writeLang(next)
    },
    dismissSuggestion: () => setSuggested(null),
  }

  return (
    <LocaleContext value={locale}>
      {children}
    </LocaleContext>
  )
}
