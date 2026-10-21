import { useEffect, useEffectEvent, useRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import useTypewriter from '@/novel/useTypewriter'
import sleep from '@/novel/sleep'
import { AUTHORS } from '@/novel/credits'
import Background from '@/novel/components/Background'
import BottomGradient from '@/novel/components/BottomGradient'
import { useFade } from '@/novel/components/Fade'
import TypedText from '@/novel/components/TypedText'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

type Props = {
  version: string | null
  onDone: () => void
}

const HOLD = 4000

export default function Credits ({ version, onDone }: Props) {
  const fade = useFade()
  const left = useTypewriter(AUTHORS[0].name, { key: 1 })
  const right = useTypewriter(AUTHORS[1].name, { key: 1 })
  const done = left.done && right.done
  const enter = useSharedValue(0)
  const out = useSharedValue(0)
  const leaving = useRef(false)
  const alive = useRef(true)

  const columnStyle = useAnimatedStyle(() => ({
    opacity: enter.get() * (1 - out.get()),
    transform: [{ translateY: interpolate(enter.get(), [0, 1], [18, 0]) }],
  }))

  useEffect(() => {
    alive.current = true
    fade.to(0, 900)
    enter.set(withTiming(1, { duration: 700, easing: EASE.easeOut }))
    return () => { alive.current = false }
  }, [fade, enter])

  async function leave () {
    if (leaving.current) {
      return
    }
    leaving.current = true
    out.set(withTiming(1, { duration: 400 }))
    await sleep(400)
    await fade.to(1, 700)
    if (alive.current) {
      onDone()
    }
  }

  const leaveLater = useEffectEvent(() => {
    leave()
  })

  useEffect(() => {
    if (!done) {
      return
    }
    const timer = setTimeout(leaveLater, HOLD)
    return () => clearTimeout(timer)
  }, [done])

  const tap = () => {
    if (!done) {
      left.finish()
      right.finish()
      return
    }
    leave()
  }

  const typed = [left.shown, right.shown]

  return (
    <Pressable onPress={tap} style={styles.screen}>
      <Background name={'bg2.png'} fx={null} instant version={version} />
      <View style={styles.dim} />
      <BottomGradient height={520} colors={GRADIENT} middle={0.52} />

      <Animated.View pointerEvents={'none'} style={[styles.row, columnStyle]}>
        {AUTHORS.map((author, i) => (
          <View key={author.handle} style={styles.column}>
            <UIText size={60} lineHeight={1.3} color={COLORS.cream} shadow numberOfLines={1}>
              <TypedText text={author.name} shown={typed[i]} />
            </UIText>
            <UIText size={34} spacing={0.06} color={COLORS.lamp}>{author.handle}</UIText>
          </View>
        ))}
      </Animated.View>
    </Pressable>
  )
}

const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.82)', 'rgba(4,3,2,.95)'] as const

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.creditsDim,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 76,
    flexDirection: 'row',
  },
  column: {
    width: 960,
    alignItems: 'center',
    gap: 22,
  },
})
