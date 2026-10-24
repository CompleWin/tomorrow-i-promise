import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { assetUrl } from '@/novel/config'
import sleep from '@/novel/sleep'
import { playCue, stopCue } from '@/novel/sound'
import useTapKeys from '@/novel/useTapKeys'
import { useFade } from '@/novel/components/Fade'
import { EASE } from '@/novel/theme'

export const TEASER_MUSIC = 'act6/music/teaser.mp3'

const PARTS = ['Guy', 'Will Return', 'In Avengers: Doomsday']
const BEATS = [0.6, 3.19, 6.18]
const MUSIC_END = 11.5
const DARKNESS = 5000
const APPEAR = 900
const WAIT_MUSIC = 3000
const VANISH = 900

const FAMILY = Platform.select({
  web: '"Avenir Next", Avenir, "Futura PT", "Helvetica Neue", Arial, sans-serif',
  ios: 'Avenir Next',
  default: 'sans-serif-medium',
})

type Props = {
  version: string | null
  onDone: () => void
}

function Part ({ text, value }: { text: string, value: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({ opacity: value.get() }))
  return <Animated.Text style={[styles.text, style]}>{text}</Animated.Text>
}

export default function Teaser ({ version, onDone }: Props) {
  const fade = useFade()
  const guy = useSharedValue(0)
  const willReturn = useSharedValue(0)
  const doomsday = useSharedValue(0)
  const out = useSharedValue(1)
  const [shown, setShown] = useState(false)
  const leaving = useRef(false)
  const alive = useRef(true)

  const lineStyle = useAnimatedStyle(() => ({ opacity: out.get() }))

  async function leave () {
    if (leaving.current) {
      return
    }
    leaving.current = true
    stopCue()
    out.set(withTiming(0, { duration: VANISH, easing: EASE.inOut }))
    await sleep(VANISH + 300)
    if (alive.current) {
      onDone()
    }
  }

  const onMusicEnd = useEffectEvent(() => {
    leave()
  })

  useEffect(() => {
    alive.current = true
    fade.set(0)
    const parts = [guy, willReturn, doomsday]
    const timers: ReturnType<typeof setTimeout>[] = []
    let started = false

    function start (at: number) {
      if (started || !alive.current) {
        return
      }
      started = true
      clearTimeout(fallback)
      parts.forEach((value, i) => {
        const delay = Math.max(0, (BEATS[i] - at) * 1000)
        value.set(withDelay(delay, withTiming(1, { duration: APPEAR, easing: EASE.easeOut })))
      })
      const full = (BEATS[BEATS.length - 1] - at) * 1000 + APPEAR
      timers.push(setTimeout(() => setShown(true), full))
      timers.push(setTimeout(onMusicEnd, (MUSIC_END - at) * 1000))
    }

    let fallback: ReturnType<typeof setTimeout> | undefined
    const dark = setTimeout(() => {
      fallback = setTimeout(() => start(0), WAIT_MUSIC)
      playCue(assetUrl(TEASER_MUSIC, version), start)
    }, DARKNESS)

    return () => {
      alive.current = false
      clearTimeout(dark)
      clearTimeout(fallback)
      timers.forEach(clearTimeout)
      stopCue()
    }
  }, [fade, guy, willReturn, doomsday, version])

  const tap = () => {
    if (shown) {
      leave()
    }
  }

  useTapKeys(tap)

  return (
    <Pressable onPress={tap} style={[styles.screen, !shown && styles.waiting]}>
      <Animated.View style={[styles.line, lineStyle]}>
        <Part text={PARTS[0]} value={guy} />
        <Part text={PARTS[1]} value={willReturn} />
        <Part text={PARTS[2]} value={doomsday} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waiting: {
    cursor: 'auto',
  },
  line: {
    flexDirection: 'row',
    gap: 34,
  },
  text: {
    fontFamily: FAMILY,
    fontSize: 46,
    fontWeight: '600',
    letterSpacing: 46 * 0.32,
    color: '#f2f2f2',
  },
})
