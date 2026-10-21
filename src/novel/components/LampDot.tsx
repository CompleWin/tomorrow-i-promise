import { Image } from 'expo-image'
import { StyleSheet, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

const DOT = 14
const GLOW = 72

export default function LampDot ({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.dot, style]}>
      <Image source={require('@/assets/ui/lamp_dot.png')}
             style={styles.glow}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    width: DOT,
    height: DOT,
    overflow: 'visible',
  },
  glow: {
    position: 'absolute',
    width: GLOW,
    height: GLOW,
    left: (DOT - GLOW) / 2,
    top: (DOT - GLOW) / 2,
  },
})
