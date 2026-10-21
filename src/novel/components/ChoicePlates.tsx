import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

type Choice = {
  index: number
  text: string
}

type Props = {
  choices: Choice[]
  onPick: (index: number) => void
}

type PlateProps = {
  text: string
  order: number
  chosen: boolean
  dropped: boolean
  onPress: () => void
}

const BRUSH_W = 552

function Plate ({ text, order, chosen, dropped, onPress }: PlateProps) {
  const [hovered, setHovered] = useState(false)
  const enter = useSharedValue(0)
  const leave = useSharedValue(0)
  const brush = useSharedValue(0)

  useEffect(() => {
    enter.set(withDelay(120 + order * 110, withTiming(1, { duration: 520, easing: EASE.out })))
  }, [order, enter])

  useEffect(() => {
    if (chosen) {
      brush.set(withTiming(1, { duration: 460, easing: EASE.wipe }))
    }
  }, [chosen, brush])

  useEffect(() => {
    if (dropped) {
      leave.set(withTiming(1, { duration: 420, easing: EASE.easeIn }))
    }
  }, [dropped, leave])

  const plateStyle = useAnimatedStyle(() => ({
    opacity: enter.get() * (1 - leave.get()),
    transform: [{ translateY: interpolate(enter.get(), [0, 1], [40, 0]) + 12 * leave.get() }],
  }))
  const brushStyle = useAnimatedStyle(() => ({
    width: BRUSH_W * brush.get(),
  }))

  return (
    <Animated.View style={plateStyle}>
      <Pressable onPress={onPress}
                 onHoverIn={() => setHovered(true)}
                 onHoverOut={() => setHovered(false)}
                 style={styles.plate}
      >
        {({ pressed }) => (
          <>
            <Image source={require('@/assets/ui/choice_plate.png')}
                   contentFit={'fill'}
                   style={StyleSheet.absoluteFill}
            />
            <Animated.View style={[styles.brushClip, brushStyle]}>
              <Image source={require('@/assets/ui/brush_red.png')}
                     contentFit={'fill'}
                     style={styles.brush}
              />
            </Animated.View>
            <View style={styles.label}>
              <UIText size={44}
                      spacing={0.06}
                      upper
                      color={hovered || pressed ? COLORS.lamp : COLORS.cream}
              >
                {text}
              </UIText>
            </View>
          </>
        )}
      </Pressable>
    </Animated.View>
  )
}

export default function ChoicePlates ({ choices, onPick }: Props) {
  const [chosen, setChosen] = useState<number | null>(null)

  const pick = (index: number) => {
    if (chosen !== null) {
      return
    }
    setChosen(index)
    onPick(index)
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.row}>
        {choices.map((choice, order) => (
          <Plate key={choice.index}
                 text={choice.text}
                 order={order}
                 chosen={chosen === choice.index}
                 dropped={chosen !== null && chosen !== choice.index}
                 onPress={() => pick(choice.index)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.dimChoice,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 320,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 56,
  },
  plate: {
    width: 600,
    height: 160,
  },
  brushClip: {
    position: 'absolute',
    left: 24,
    top: 24,
    height: 112,
    overflow: 'hidden',
  },
  brush: {
    width: BRUSH_W,
    height: 112,
  },
  label: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
