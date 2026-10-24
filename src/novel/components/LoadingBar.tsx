import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import UIText from '@/novel/components/UIText'
import { loadProgress } from '@/novel/content'
import { COLORS, EASE } from '@/novel/theme'

const CELLS = 20
const POLL_MS = 150
const BLINK_MS = 600
const EASE_POWER = 2

function shownProgress () {
  return loadProgress() ** EASE_POWER
}

type Props = {
  active?: boolean
}

export default function LoadingBar ({ active = true }: Props) {
  const [progress, setProgress] = useState(shownProgress)
  const blink = useSharedValue(0)

  useEffect(() => {
    if (!active) {
      return
    }
    const timer = setInterval(() => setProgress(shownProgress()), POLL_MS)
    return () => clearInterval(timer)
  }, [active])

  useEffect(() => {
    blink.set(withRepeat(withTiming(1, { duration: BLINK_MS, easing: EASE.inOut }), -1, true))
    return () => cancelAnimation(blink)
  }, [blink])

  const blinkStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + 0.6 * blink.get(),
  }))

  const lit = Math.min(CELLS, Math.floor(progress * CELLS))

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <UIText size={30} color={COLORS.muted}>Загрузка</UIText>
        <UIText size={30} color={COLORS.lamp}>{`${Math.floor(progress * 100)}%`}</UIText>
      </View>
      <View style={styles.row}>
        {Array.from({ length: CELLS }, (_, i) => (
          <View key={i} style={[styles.cell, i < lit && styles.cellOn]}>
            {i === lit && <Animated.View style={[styles.glow, blinkStyle]} />}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: 670,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: 24,
    height: 36,
    backgroundColor: COLORS.cellOff,
  },
  cellOn: {
    backgroundColor: COLORS.lamp,
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.lamp,
  },
})
