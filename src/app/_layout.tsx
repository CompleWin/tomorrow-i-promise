import { Stack, usePathname } from 'expo-router'
import Head from 'expo-router/head'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GALMURI } from '@/novel/font'
import { routeLang } from '@/novel/i18n'
import { SEO } from '@/novel/i18n/seo'
import { FadeProvider } from '@/novel/components/Fade'
import { BannerProvider } from '@/novel/components/Banner'
import FullscreenButton from '@/novel/components/FullscreenButton'
import { LocaleProvider, useLocale } from '@/novel/components/Locale'
import { StageOverlay } from '@/novel/components/Stage'

SplashScreen.preventAutoHideAsync()

function Screens () {
  const { lang } = useLocale()
  const title = SEO[lang].title

  return (
    <>
      <Head>
        <html lang={lang} />
        <title>{title}</title>
      </Head>
      <Stack screenOptions={{ headerShown: false, title }} />
      <StageOverlay>
        <FullscreenButton />
      </StageOverlay>
    </>
  )
}

export default function RootLayout () {
  const [loaded, error] = useFonts({ Galmuri11: GALMURI })
  const pathname = usePathname()

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (error) {
    console.warn('font failed to load', error)
  }

  if (!loaded && !error) {
    return null
  }

  return (
    <>
      {routeLang(pathname) === null && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      <LocaleProvider>
        <FadeProvider>
          <BannerProvider>
            <Screens />
          </BannerProvider>
        </FadeProvider>
      </LocaleProvider>
    </>
  )
}
