import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

const PULSE_MS = 900

type Props = {
  labels: string[]
}

function Block ({ size, children }: { size: number, children: string }) {
  return (
    <View style={styles.block}>
      <UIText size={size} color={'transparent'}>{children}</UIText>
    </View>
  )
}

export default function MenuSkeleton ({ labels }: Props) {
  const pulse = useSharedValue(0)

  useEffect(() => {
    pulse.set(withRepeat(withTiming(1, { duration: PULSE_MS, easing: EASE.inOut }), -1, true))
    return () => cancelAnimation(pulse)
  }, [pulse])

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + 0.55 * pulse.get(),
  }))

  return (
    <Animated.View pointerEvents={'none'} style={[StyleSheet.absoluteFill, pulseStyle]}>
      <View style={styles.column}>
        <View style={[styles.block, styles.menu]}>
          <View style={styles.title}>
            <UIText size={132} color={'transparent'}>Завтра</UIText>
            <UIText size={132} color={'transparent'}>точно</UIText>
          </View>
          <View>
            {labels.map(label => (
              <View key={label} style={styles.item}>
                <UIText size={52} color={'transparent'}>{label}</UIText>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.corner, styles.version]}>
        <Block size={24}>version: 00000000</Block>
      </View>
      <View style={[styles.corner, styles.github]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  column: {
    ...StyleSheet.absoluteFill,
    left: 150,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menu: {
    gap: 84,
  },
  title: {
    gap: 28,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
  },
  block: {
    backgroundColor: COLORS.cellOff,
  },
  corner: {
    position: 'absolute',
    bottom: 40,
  },
  version: {
    left: 48,
  },
  github: {
    right: 48,
    width: 52,
    height: 52,
    backgroundColor: COLORS.cellOff,
  },
})
