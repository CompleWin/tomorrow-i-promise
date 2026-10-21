import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { assetSource } from '@/novel/preload'
import type { MenuArt } from '@/novel/menuArt'
import { COLORS } from '@/novel/theme'

const FLICK = {
  offsets: [0, 0.44, 0.445, 0.455, 0.47, 0.48, 0.76, 0.765, 0.85, 0.855, 0.865, 0.88, 1],
  values: [1, 1, 0.3, 1, 0.55, 1, 1, 0.03, 0.03, 0.75, 0.06, 1, 1],
}
const FLICK_MS = 7000
const APPEAR_MS = 400

const GRADIENT = ['rgba(6,4,3,.95)', 'rgba(6,4,3,.84)', 'rgba(6,4,3,0)'] as const

type Props = {
  art: MenuArt
  version: string | null
}

type LayerProps = {
  path: string
  version: string | null
  flick?: SharedValue<number>
}

function ArtLayer ({ path, version, flick }: LayerProps) {
  const appear = useSharedValue(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) {
      appear.set(withTiming(1, { duration: APPEAR_MS }))
    }
  }, [loaded, appear])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: appear.get() * (flick ? interpolate(flick.get(), FLICK.offsets, FLICK.values) : 1),
  }))

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <Image source={assetSource(path, version)}
             style={StyleSheet.absoluteFill}
             contentFit={'cover'}
             onLoad={() => setLoaded(true)}
      />
    </Animated.View>
  )
}

export default function MenuBackground ({ art, version }: Props) {
  const flick = useSharedValue(0)

  useEffect(() => {
    flick.set(withRepeat(withTiming(1, { duration: FLICK_MS, easing: Easing.linear }), -1, false))
  }, [flick])

  return (
    <View style={styles.root} pointerEvents={'none'}>
      <ArtLayer key={art.base} path={art.base} version={version} />
      {art.flicker !== undefined && (
        <ArtLayer key={art.flicker} path={art.flicker} version={version} flick={flick} />
      )}
      <LinearGradient colors={GRADIENT}
                      locations={[0, 0.27, 0.57]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.inkBlack,
  },
})
