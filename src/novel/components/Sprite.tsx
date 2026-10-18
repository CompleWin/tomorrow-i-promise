import { Image } from 'expo-image'
import { CONTENT_URL } from '@/novel/config'
import { StyleSheet } from 'react-native'

export default function Sprite({ name }: { name: string | null }) {
  if (!name) {
    return null
  }

  return (
    <Image
      source={`${CONTENT_URL}/assets/${name}`}
      style={styles.sprite}
      contentFit={'contain'}
    />
  )
}

const styles = StyleSheet.create({
  sprite: {
    position: 'absolute',
    left: '4%',
    bottom: '2.4%',
    height: '64%',
    aspectRatio: 1086 / 1448,
  }
})