import { StyleSheet, View, Text } from 'react-native'
import { useStageSize } from '@/novel/components/Stage'

type Props = {
  speaker: string | null
  text: string
}

export default function TextBox ({ speaker, text }: Props) {
  const { w } = useStageSize()

  const speakerFontSize = w * 0.018
  const textFontSize = w * 0.026

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.plate}>
        {speaker ?
          <Text style={[styles.speaker, { fontSize: speakerFontSize }]}>
            {speaker}
          </Text>
          :
          null}
      </View>
      <View style={styles.window}>
        <Text style={[
          styles.text,
          {
            fontSize: textFontSize,
            lineHeight: textFontSize * 1.4,
          }]}>{text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  plate: {
    position: 'absolute',
    left: '73.6%',
    right: '5.9%',
    top: '72.1%',
    height: '6.2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  window: {
    position: 'absolute',
    justifyContent: 'center',
    left: '10%',
    right: '2.9%',
    top: '76.3%',
    bottom: '2%',
    padding: '1.5%',
  },
  speaker: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },

})