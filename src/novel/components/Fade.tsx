import { createContext, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { EASE } from '@/novel/theme'

type Fade = {
  to: (opacity: 0 | 1, ms: number) => Promise<void>
  set: (opacity: 0 | 1) => void
  isBlack: () => boolean
}

const FadeContext = createContext<Fade | null>(null)

export function useFade (): Fade {
  const fade = useContext(FadeContext)
  if (fade === null) {
    throw new Error('useFade outside FadeProvider')
  }
  return fade
}

export function FadeProvider ({ children }: { children: ReactNode }) {
  const opacity = useSharedValue(0)
  const [blocking, setBlocking] = useState(false)
  const lastCall = useRef(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  const fade = useMemo<Fade>(() => ({
    set (value) {
      lastCall.current += 1
      opacity.set(value)
      setBlocking(value !== 0)
    },
    to (value, ms) {
      const call = ++lastCall.current
      setBlocking(true)

      return new Promise<void>(resolve => {
        const done = () => {
          if (call === lastCall.current && value === 0) {
            setBlocking(false)
          }
          resolve()
        }
        opacity.set(withTiming(value, { duration: ms, easing: EASE.inOut }, () => {
          scheduleOnRN(done)
        }))
      })
    },
    isBlack () {
      return opacity.get() > 0
    },
  }), [opacity])

  return (
    <FadeContext value={fade}>
      <View style={styles.root}>
        {children}
        <Animated.View style={[styles.veil, { pointerEvents: blocking ? 'auto' : 'none' }, animatedStyle]} />
      </View>
    </FadeContext>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  veil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
})
