import { useEffect, useRef } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import sleep from '@/novel/sleep'
import useTapKeys from '@/novel/useTapKeys'
import { useFade } from '@/novel/components/Fade'
import GitHubStar from '@/novel/components/GitHubStar'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

type Props = {
  onDone: () => void
}

export default function Thanks ({ onDone }: Props) {
  const fade = useFade()
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
    if (alive.current) {
      onDone()
    }
  }

  useTapKeys(leave)

  return (
    <Pressable onPress={leave} style={styles.screen}>
      <Animated.View pointerEvents={'box-none'} style={[styles.column, columnStyle]}>
        <UIText size={60} lineHeight={1.3} color={COLORS.cream} shadow>Спасибо за игру!</UIText>
        <GitHubStar />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    alignItems: 'center',
    gap: 56,
  },
})
