import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { CONTENT_URL } from '@/novel/config'

export function Background ({ name }: { name: string | null }) {
  if (!name) {
    return null
  }

  return (
    <Image
      source={`${CONTENT_URL}/assets/bg/${name}`}
      style={StyleSheet.absoluteFill}
      contentFit={'cover'}
      transition={300}
    />
  )
}