import { useEffect, useEffectEvent } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import TypedText from '@/novel/components/TypedText'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE } from '@/novel/theme'

type Props = {
  speaker: string | null
  text: string
  shown: number
  instant?: boolean
  intro?: boolean
}

function SpeakerName ({ name, instant }: { name: string | null, instant: boolean }) {
  const width = useSharedValue(0)
  const wipe = useSharedValue(1)

  const reveal = useEffectEvent(() => {
    if (instant) {
      wipe.set(1)
      return
    }
    wipe.set(0)
    wipe.set(withTiming(1, { duration: 320, easing: EASE.wipe }))
  })

  useEffect(() => {
    if (name !== null) {
      reveal()
    }
  }, [name])

  const clipStyle = useAnimatedStyle(() => ({
    width: width.get() * wipe.get(),
  }))
  const textStyle = useAnimatedStyle(() => ({
    width: width.get(),
  }))

  return (
    <View style={name === null && styles.hidden}>
      <View style={styles.hidden}
            onLayout={e => width.set(Math.ceil(e.nativeEvent.layout.width) + 1)}
      >
        <UIText size={34} lineHeight={1.4} color={COLORS.lamp} spacing={0.06} numberOfLines={1} style={styles.name}>
          {name ?? ' '}
        </UIText>
      </View>
      <Animated.View style={[styles.clip, clipStyle]}>
        <Animated.View style={textStyle}>
          <UIText size={34} lineHeight={1.4} color={COLORS.lamp} spacing={0.06} numberOfLines={1} style={styles.name}>
            {name ?? ' '}
          </UIText>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export default function Subtitles ({ speaker, text, shown, instant = false, intro = false }: Props) {
  const enter = useSharedValue(intro ? 0 : 1)

  useEffect(() => {
    if (intro) {
      enter.set(withDelay(700, withTiming(1, { duration: 600, easing: EASE.out })))
    }
  }, [intro, enter])

  const boxStyle = useAnimatedStyle(() => ({
    opacity: enter.get(),
    transform: [{ translateY: interpolate(enter.get(), [0, 1], [30, 0]) }],
  }))

  return (
    <Animated.View pointerEvents={'none'} style={[styles.box, boxStyle]}>
      <SpeakerName name={speaker} instant={instant} />
      <UIText size={48}
              lineHeight={1.4}
              align={'center'}
              shadow
              color={speaker === null ? COLORS.narration : COLORS.cream}
      >
        <TypedText text={text} shown={shown} />
      </UIText>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 240,
    right: 240,
    bottom: 76,
    alignItems: 'center',
    gap: 22,
  },
  hidden: {
    opacity: 0,
  },
  name: {
    marginVertical: -7,
  },
  clip: {
    position: 'absolute',
    left: 0,
    top: -16,
    bottom: -16,
    paddingTop: 16,
    overflow: 'hidden',
  },
})
