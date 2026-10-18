import { Image } from 'expo-image'
import { CONTENT_URL } from '@/novel/config'
import { StyleSheet } from 'react-native'

export default function TextBoxFrame () {
  return (
    <Image
      source={`${CONTENT_URL}/assets/text_box.png`}
      style={StyleSheet.absoluteFill}
    />
  )
}
