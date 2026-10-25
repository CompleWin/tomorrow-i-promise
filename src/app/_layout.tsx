import { Stack, usePathname } from 'expo-router'
import Head from 'expo-router/head'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import app from '../../app.json'
import { GALMURI } from '@/novel/font'
import { FadeProvider } from '@/novel/components/Fade'
import { BannerProvider } from '@/novel/components/Banner'
import FullscreenButton from '@/novel/components/FullscreenButton'
import { StageOverlay } from '@/novel/components/Stage'

SplashScreen.preventAutoHideAsync()

const TITLE = `${app.expo.name}`
const SITE = 'https://tomorrow-i-promise.ru/'

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
    <FadeProvider>
      <BannerProvider>
        <Head>
          <title>{TITLE}</title>
          {pathname === '/'
            ? <link rel="canonical" href={SITE} />
            : <meta name="robots" content="noindex, follow" />}
        </Head>
        <Stack screenOptions={{ headerShown: false, title: TITLE }} />
        <StageOverlay>
          <FullscreenButton />
        </StageOverlay>
      </BannerProvider>
    </FadeProvider>
  )
}
