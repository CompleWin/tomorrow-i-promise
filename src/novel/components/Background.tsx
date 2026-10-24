import { useCallback, useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { assetSource } from '@/novel/preload'
import { BG_DURATION, EASE, FRAME_STEP } from '@/novel/theme'

type Mode = 'default' | 'fadeIn' | 'close' | 'blackout' | 'lightsOn' | 'move' | 'frame' | 'instant'

type Layer = {
  key: number
  name: string
  mode: Mode
}

type Sequence = {
  name: string | null
  frames: string[]
  index: number
}

type Props = {
  name: string | null
  frames?: string[]
  fx: string | null
  instant?: boolean
  version: string | null
}

const MODES: Mode[] = ['fadeIn', 'close', 'blackout', 'lightsOn', 'move']

const ENTER = {
  default: { duration: BG_DURATION.default, easing: EASE.inOut },
  fadeIn: { duration: BG_DURATION.fadeIn, easing: EASE.easeOut },
  close: { duration: BG_DURATION.close, easing: EASE.close },
  blackout: { duration: BG_DURATION.blackout, easing: Easing.linear },
  lightsOn: { duration: BG_DURATION.lightsOn, easing: Easing.linear },
  move: { duration: BG_DURATION.move, easing: EASE.move },
  frame: { duration: BG_DURATION.frame, easing: EASE.inOut },
  instant: { duration: 0, easing: Easing.linear },
}

const NUDGE = 1.015

const BLACKOUT_OUT = {
  offsets: [0, 0.12, 0.2, 0.32, 0.4, 0.55, 0.62, 0.7, 1],
  values: [1, 0.25, 1, 0.5, 1, 0.1, 0.7, 0, 0],
}
const BLACKOUT_IN = {
  offsets: [0, 0.72, 1],
  values: [0, 0, 1],
}
const LIGHTS_ON = {
  offsets: [0, 0.15, 0.25, 0.4, 0.5, 0.62, 1],
  values: [0, 0.85, 0.05, 0.9, 0.3, 1, 1],
}

function toMode (fx: string | null, instant: boolean): Mode {
  if (instant) {
    return 'instant'
  }
  return MODES.find(m => m === fx) ?? 'default'
}

type LayerProps = {
  layerKey: number
  name: string
  mode: Mode
  leaving: boolean
  version: string | null
  onDone: (key: number) => void
  onMove: () => void
}

function BackgroundLayer ({ layerKey, name, mode, leaving, version, onDone, onMove }: LayerProps) {
  const enter = useSharedValue(mode === 'instant' ? 1 : 0)
  const out = useSharedValue(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      return
    }
    if (mode === 'instant') {
      onDone(layerKey)
      return
    }
    if (mode === 'move') {
      onMove()
    }
    enter.set(withTiming(1, ENTER[mode], finished => {
      if (finished) {
        scheduleOnRN(onDone, layerKey)
      }
    }))
  }, [loaded, mode, enter, onDone, onMove, layerKey])

  useEffect(() => {
    if (leaving) {
      out.set(withTiming(1, { duration: 1200, easing: Easing.linear }))
    }
  }, [leaving, out])

  const animatedStyle = useAnimatedStyle(() => {
    const p = enter.get()
    let opacity = p
    let scale = 1
    if (mode === 'blackout') {
      opacity = interpolate(p, BLACKOUT_IN.offsets, BLACKOUT_IN.values)
    } else if (mode === 'lightsOn') {
      opacity = interpolate(p, LIGHTS_ON.offsets, LIGHTS_ON.values)
    } else if (mode === 'close') {
      scale = interpolate(p, [0, 1], [1.07, 1])
    }
    if (leaving) {
      opacity *= interpolate(out.get(), BLACKOUT_OUT.offsets, BLACKOUT_OUT.values)
    }
    return { opacity, transform: [{ scale }] }
  })

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <Image
        source={assetSource(name, version)}
        style={[StyleSheet.absoluteFill, !loaded && styles.hidden]}
        contentFit={'cover'}
        onLoad={() => setLoaded(true)}
      />
    </Animated.View>
  )
}

export default function Background ({ name, frames = [], fx, instant = false, version }: Props) {
  const [sequence, setSequence] = useState<Sequence>({ name: null, frames: [], index: 0 })
  const [stack, setStack] = useState<{ name: string | null, serial: number, layers: Layer[] }>(
    { name: null, serial: 0, layers: [] })
  const zoom = useSharedValue(1)
  const nudge = useSharedValue(0)

  let current = sequence
  if (name !== sequence.name) {
    current = { name, frames: instant || frames.length < 2 ? [] : frames, index: 0 }
    setSequence(current)
  }
  const shown = current.frames[current.index] ?? name

  if (shown !== stack.name) {
    const mode = current.index > 0 ? 'frame' : toMode(fx, instant)
    const serial = stack.serial + 1
    const kept = mode === 'fadeIn' || mode === 'instant' || shown === null ? [] : stack.layers
    setStack({
      name: shown,
      serial,
      layers: shown === null ? [] : [...kept, { key: serial, name: shown, mode }],
    })
  }

  useEffect(() => {
    if (sequence.index >= sequence.frames.length - 1) {
      return
    }
    const timer = setTimeout(() => {
      setSequence(s => s.name === sequence.name ? { ...s, index: s.index + 1 } : s)
    }, FRAME_STEP)
    return () => clearTimeout(timer)
  }, [sequence])

  useEffect(() => {
    zoom.set(withRepeat(withTiming(1.04, { duration: 30000, easing: EASE.inOut }), -1, true))
  }, [zoom])

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoom.get() * interpolate(nudge.get(), [0, 0.5, 1], [1, NUDGE, 1]) }],
  }))

  const settle = useCallback((key: number) => {
    setStack(s => ({ ...s, layers: s.layers.filter(l => l.key >= key) }))
  }, [])

  const push = useCallback(() => {
    nudge.set(0)
    nudge.set(withTiming(1, ENTER.move))
  }, [nudge])

  return (
    <Animated.View style={[StyleSheet.absoluteFill, zoomStyle]} pointerEvents={'none'}>
      {stack.layers.map((layer, i) => (
        <BackgroundLayer
          key={layer.key}
          layerKey={layer.key}
          name={layer.name}
          mode={layer.mode}
          leaving={stack.layers[i + 1]?.mode === 'blackout'}
          version={version}
          onDone={settle}
          onMove={push}
        />
      ))}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
})
