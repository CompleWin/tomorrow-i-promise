import { useEffect } from 'react'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useLocale } from '@/novel/components/Locale'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

const BLINK_MS = 800

export default function ContinuePrompt () {
  const { t } = useLocale()
  const blink = useSharedValue(1)

  useEffect(() => {
    blink.set(withRepeat(withTiming(0.2, { duration: BLINK_MS, easing: EASE.inOut }), -1, true))
    return () => cancelAnimation(blink)
  }, [blink])

  const blinkStyle = useAnimatedStyle(() => ({
    opacity: blink.get(),
  }))

  return (
    <Animated.View style={blinkStyle}>
      <UIText size={30} color={COLORS.cream}>{t.tapToContinue}</UIText>
    </Animated.View>
  )
}
