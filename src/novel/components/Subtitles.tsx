import { StyleSheet, Text, View } from 'react-native'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

type Props = {
  speaker: string | null
  text: string
  shown: number
}

export default function Subtitles ({ speaker, text, shown }: Props) {
  return (
    <View pointerEvents={'none'} style={styles.box}>
      <UIText size={34}
              color={COLORS.lamp}
              spacing={0.06}
              numberOfLines={1}
              style={speaker === null && styles.hidden}
      >
        {speaker ?? ' '}
      </UIText>
      <UIText size={48}
              lineHeight={1.4}
              align={'center'}
              shadow
              color={speaker === null ? COLORS.narration : COLORS.cream}
      >
        {text.slice(0, shown)}
        <Text style={styles.rest}>{text.slice(shown)}</Text>
      </UIText>
    </View>
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
  rest: {
    color: 'transparent',
    textShadowColor: 'transparent',
  },
})
