import { useEffect } from 'react'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

const BLINK_MS = 800

export default function ContinuePrompt () {
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
      <UIText size={30} color={COLORS.cream}>Нажмите, чтобы продолжить</UIText>
    </Animated.View>
  )
}
