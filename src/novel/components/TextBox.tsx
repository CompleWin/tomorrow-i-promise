import { StyleSheet, View, Text } from 'react-native'
import { Image } from 'expo-image'
import { useStageSize } from '@/novel/components/Stage'
import { CONTENT_URL } from '@/novel/config'

type Props = {
  speaker: string | null
  text: string
}

export function TextBox ({ speaker, text }: Props) {
  const { w } = useStageSize()

  const speakerFontSize = w * 0.02
  const textFontSize = w * 0.018

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image
        source={`${CONTENT_URL}/assets/text_box.png`}
        style={StyleSheet.absoluteFill}
      />
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
    left: '2.9%',
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
  },

})