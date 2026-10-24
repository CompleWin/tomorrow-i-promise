import { useEffect, useEffectEvent, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { loadProgress } from '@/novel/content'
import { COLORS, EASE } from '@/novel/theme'

const HOUSES = [74, 58, 90, 66, 80, 54, 86, 70, 62, 78]
const WINDOWS_PER_HOUSE = 2
const CELLS = HOUSES.length * WINDOWS_PER_HOUSE
const ROOF = [10, 26, 42, 58]
const POLL_MS = 150
const BLINK_MS = 600
const EASE_POWER = 2

type Props = {
  active?: boolean
  progress?: () => number
}

export default function LoadingBar ({ active = true, progress: read = loadProgress }: Props) {
  const [progress, setProgress] = useState(() => read() ** EASE_POWER)
  const blink = useSharedValue(0)
  const poll = useEffectEvent(() => setProgress(read() ** EASE_POWER))

  useEffect(() => {
    if (!active) {
      return
    }
    const timer = setInterval(poll, POLL_MS)
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
      <View style={styles.street}>
        {HOUSES.map((height, house) => (
          <View key={house} style={styles.house}>
            {house % 3 === 1
              ? (
                <View style={styles.chimneyRow}>
                  <View style={styles.chimney} />
                </View>
              )
              : ROOF.map(width => <View key={width} style={[styles.roof, { width }]} />)}
            <View style={[styles.body, { height }]}>
              {Array.from({ length: WINDOWS_PER_HOUSE }, (_, w) => {
                const i = house * WINDOWS_PER_HOUSE + w
                return (
                  <View key={w} style={[styles.window, i < lit && styles.windowOn]}>
                    {i === lit && <Animated.View style={[styles.glow, blinkStyle]} />}
                  </View>
                )
              })}
            </View>
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
  street: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  house: {
    width: 58,
    alignItems: 'center',
  },
  roof: {
    height: 6,
    backgroundColor: COLORS.cellOff,
  },
  chimneyRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chimney: {
    width: 10,
    height: 14,
    backgroundColor: COLORS.cellOff,
  },
  body: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 12,
    backgroundColor: COLORS.cellOff,
  },
  window: {
    width: 14,
    height: 20,
    backgroundColor: COLORS.cellOff,
  },
  windowOn: {
    backgroundColor: COLORS.lamp,
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.lamp,
  },
})
