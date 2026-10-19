import { Image } from 'expo-image'
import { assetUrl } from '@/novel/config'
import { StyleSheet } from 'react-native'

type Props = {
  version: string | null
}

export default function TextBoxFrame ({ version }: Props) {

  const textBoxFramePath = 'text_box.png'

  return (
    <Image
      source={assetUrl(textBoxFramePath, version)}
      style={StyleSheet.absoluteFill}
    />
  )
}
