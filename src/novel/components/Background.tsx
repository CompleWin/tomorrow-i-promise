import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { assetUrl } from '@/novel/config'

type Props = {
  name: string | null
  version: string | null
}

export default function Background ({ name, version }: Props) {
  if (!name) {
    return null
  }

  return (
    <Image
      source={assetUrl(`bg/${name}`, version)}
      style={StyleSheet.absoluteFill}
      contentFit={'cover'}
      transition={300}
    />
  )
}