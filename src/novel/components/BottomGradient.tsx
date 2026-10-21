import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const OVERSCAN = 40

type Props = {
  height: number
  colors: readonly [string, string, string]
  middle: number
}

export default function BottomGradient ({ height, colors, middle }: Props) {
  const k = height / (height + OVERSCAN)

  return (
    <LinearGradient colors={[colors[0], colors[1], colors[2], colors[2]]}
                    locations={[0, middle * k, k, 1]}
                    pointerEvents={'none'}
                    style={[styles.gradient, { height: height + OVERSCAN }]}
    />
  )
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -OVERSCAN,
  },
})
