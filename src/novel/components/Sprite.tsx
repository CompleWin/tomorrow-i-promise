import { useCallback, useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { assetSource } from '@/novel/preload'
import { EASE } from '@/novel/theme'

type Enter = 'slide' | 'slideLate' | 'swap' | 'instant'
type Leave = 'out' | 'swap' | 'fade'

type Layer = {
  key: number
  name: string
  enter: Enter
  leave: Leave | null
}

type Props = {
  name: string | null
  version: string | null
  hidden?: boolean
  instant?: boolean
}

const SLIDE = { duration: 420, easing: EASE.out }
const SWAP_IN = { duration: 200, easing: EASE.easeOut }
const LEAVE = {
  out: { duration: 220, easing: EASE.easeIn },
  swap: { duration: 220, easing: Easing.linear },
  fade: { duration: 240, easing: Easing.linear },
}
const JUMP = {
  offsets: [0, 0.35, 1],
  values: [0, -14, 0],
  timing: { duration: 340, easing: EASE.easeOut },
}

function who (name: string) {
  const base = name.split('/').pop() ?? ''
  return base.startsWith('guy_') ? 'guy' : 'martha'
}

type LayerProps = {
  layerKey: number
  name: string
  enter: Enter
  leave: Leave | null
  version: string | null
  onDone: (key: number) => void
}

function SpriteLayer ({ layerKey, name, enter, leave, version, onDone }: LayerProps) {
  const right = who(name) === 'guy'
  const dir = right ? 1 : -1
  const sliding = enter === 'slide' || enter === 'slideLate'
  const opacity = useSharedValue(enter === 'instant' ? 1 : 0)
  const x = useSharedValue(sliding ? dir * 46 : 0)
  const jump = useSharedValue(1)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded || leave !== null || enter === 'instant') {
      return
    }
    const delay = enter === 'slideLate' ? 140 : 0
    if (enter === 'swap') {
      opacity.set(withTiming(1, SWAP_IN))
    } else {
      opacity.set(withDelay(delay, withTiming(1, SLIDE)))
      x.set(withDelay(delay, withTiming(0, SLIDE)))
    }
    if (name.includes('suprised')) {
      jump.set(0)
      jump.set(withDelay(delay, withTiming(1, JUMP.timing)))
    }
  }, [loaded, leave, enter, name, opacity, x, jump])

  useEffect(() => {
    if (leave === null) {
      return
    }
    opacity.set(withTiming(0, LEAVE[leave], finished => {
      if (finished) {
        scheduleOnRN(onDone, layerKey)
      }
    }))
    if (leave === 'out') {
      x.set(withTiming(dir * 30, LEAVE.out))
    }
  }, [leave, dir, opacity, x, onDone, layerKey])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x.get() },
      { translateY: interpolate(jump.get(), JUMP.offsets, JUMP.values) },
    ],
  }))

  return (
    <Animated.View style={[styles.sprite, right ? styles.right : styles.left, animatedStyle]}>
      <Image
        source={assetSource(name, version)}
        style={[StyleSheet.absoluteFill, !loaded && styles.hidden]}
        contentFit={'contain'}
        onLoad={() => setLoaded(true)}
      />
    </Animated.View>
  )
}

export default function Sprite ({ name, version, hidden = false, instant = false }: Props) {
  const [stack, setStack] = useState<{ name: string | null, serial: number, layers: Layer[] }>(
    { name: null, serial: 0, layers: [] })
  const shown = hidden ? null : name

  if (shown !== stack.name) {
    const serial = stack.serial + 1
    const current = stack.layers.find(l => l.leave === null)
    let layers: Layer[]

    if (instant) {
      layers = shown === null ? [] : [{ key: serial, name: shown, enter: 'instant', leave: null }]
    } else {
      let enter: Enter = 'slide'
      let leave: Leave = 'fade'
      if (shown !== null && current !== undefined) {
        const same = who(current.name) === who(shown)
        enter = same ? 'swap' : 'slideLate'
        leave = same ? 'swap' : 'out'
      }
      layers = stack.layers.map(l => l === current ? { ...l, leave } : l)
      if (shown !== null) {
        layers.push({ key: serial, name: shown, enter, leave: null })
      }
    }

    setStack({ name: shown, serial, layers })
  }

  const settle = useCallback((key: number) => {
    setStack(s => ({ ...s, layers: s.layers.filter(l => l.key !== key) }))
  }, [])

  return (
    <View pointerEvents={'none'} style={StyleSheet.absoluteFill}>
      {stack.layers.map(layer => (
        <SpriteLayer
          key={layer.key}
          layerKey={layer.key}
          name={layer.name}
          enter={layer.enter}
          leave={layer.leave}
          version={version}
          onDone={settle}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  sprite: {
    position: 'absolute',
    bottom: 0,
    width: 583.5,
    height: 778,
  },
  left: {
    left: 96,
  },
  right: {
    right: 96,
  },
  hidden: {
    opacity: 0,
  },
})
