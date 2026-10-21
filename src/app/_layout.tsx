import { Stack } from 'expo-router'
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

export default function RootLayout () {
  const [loaded, error] = useFonts({ Galmuri11: GALMURI })

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
          <title>{app.expo.name}</title>
        </Head>
        <Stack screenOptions={{ headerShown: false, title: app.expo.name }} />
        <StageOverlay>
          <FullscreenButton />
        </StageOverlay>
      </BannerProvider>
    </FadeProvider>
  )
}
