import { Image } from 'expo-image'
import { assetUrl } from '@/novel/config'
import { StyleSheet } from 'react-native'

type Props = {
  name: string | null
  version: string | null
  hidden?: boolean
}

function isRight (name: string | null) {
  const base = name?.split('/').pop() ?? ''
  return base.startsWith('guy_')
}

export default function Sprite ({ name, version, hidden = false }: Props) {
  const visible = name !== null && !hidden

  return (
    <Image
      source={name === null ? null : assetUrl(name, version)}
      style={[
        styles.sprite,
        isRight(name) ? styles.right : styles.left,
        !visible && styles.hidden,
      ]}
      contentFit={'contain'}
      pointerEvents={'none'}
    />
  )
}

const styles = StyleSheet.create({
  sprite: {
    position: 'absolute',
    bottom: 0,
    width: 583.5,
    height: 778,
  },
  left: {
    left: 96,
  },
  right: {
    right: 96,
  },
  hidden: {
    opacity: 0,
  },
})
