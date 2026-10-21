import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GALMURI } from '@/novel/font'
import { FadeProvider } from '@/novel/components/Fade'

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
      <Stack screenOptions={{ headerShown: false }} />
    </FadeProvider>
  )
}
