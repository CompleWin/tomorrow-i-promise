import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { MENU_ART_COMPLETED } from '@/novel/menuArt'
import Background from '@/novel/components/Background'
import BottomGradient from '@/novel/components/BottomGradient'
import { BG_DURATION, COLORS } from '@/novel/theme'

const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.7)', 'rgba(4,3,2,.88)'] as const

type Props = {
  version: string | null
  result?: boolean
}

export default function EndingBackdrop ({ version, result = false }: Props) {
  const shade = useSharedValue(result ? 1 : 0)

  useEffect(() => {
    shade.set(withTiming(result ? 1 : 0, { duration: BG_DURATION.fadeIn }))
  }, [result, shade])

  const dimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(shade.get(), [0, 1], [COLORS.creditsDim, COLORS.resultDim]),
  }))
  const gradientStyle = useAnimatedStyle(() => ({
    opacity: shade.get(),
  }))

  return (
    <>
      <Background name={MENU_ART_COMPLETED.base} fx={null} instant version={version} />
      <Animated.View pointerEvents={'none'} style={[styles.fill, dimStyle]} />
      <Animated.View pointerEvents={'none'} style={[styles.fill, gradientStyle]}>
        <BottomGradient height={720} colors={GRADIENT} middle={0.42} />
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
  },
})
