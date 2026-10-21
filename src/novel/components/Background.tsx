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
import { EASE } from '@/novel/theme'

type Mode = 'default' | 'fadeIn' | 'close' | 'blackout' | 'lightsOn' | 'instant'

type Layer = {
  key: number
  name: string
  mode: Mode
}

type Props = {
  name: string | null
  fx: string | null
  instant?: boolean
  version: string | null
}

const MODES: Mode[] = ['fadeIn', 'close', 'blackout', 'lightsOn']

const ENTER = {
  default: { duration: 700, easing: EASE.inOut },
  fadeIn: { duration: 1400, easing: EASE.easeOut },
  close: { duration: 1600, easing: EASE.close },
  blackout: { duration: 1500, easing: Easing.linear },
  lightsOn: { duration: 1000, easing: Easing.linear },
  instant: { duration: 0, easing: Easing.linear },
}

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
}

function BackgroundLayer ({ layerKey, name, mode, leaving, version, onDone }: LayerProps) {
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
    enter.set(withTiming(1, ENTER[mode], finished => {
      if (finished) {
        scheduleOnRN(onDone, layerKey)
      }
    }))
  }, [loaded, mode, enter, onDone, layerKey])

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

export default function Background ({ name, fx, instant = false, version }: Props) {
  const [stack, setStack] = useState<{ name: string | null, serial: number, layers: Layer[] }>(
    { name: null, serial: 0, layers: [] })
  const zoom = useSharedValue(1)

  if (name !== stack.name) {
    const mode = toMode(fx, instant)
    const serial = stack.serial + 1
    const kept = mode === 'fadeIn' || mode === 'instant' || name === null ? [] : stack.layers
    setStack({
      name,
      serial,
      layers: name === null ? [] : [...kept, { key: serial, name, mode }],
    })
  }

  useEffect(() => {
    zoom.set(withRepeat(withTiming(1.04, { duration: 30000, easing: EASE.inOut }), -1, true))
  }, [zoom])

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoom.get() }],
  }))

  const settle = useCallback((key: number) => {
    setStack(s => ({ ...s, layers: s.layers.filter(l => l.key >= key) }))
  }, [])

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
