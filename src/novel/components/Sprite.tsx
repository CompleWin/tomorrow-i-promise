import { Image } from 'expo-image'
import { assetUrl } from '@/novel/config'
import { StyleSheet } from 'react-native'

type Props = {
  name: string | null
  version: string | null
}

export default function Sprite({ name, version }: Props) {
  if (!name) {
    return null
  }

  return (
    <Image
      source={assetUrl(name, version)}
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