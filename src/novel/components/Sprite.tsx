import { useState } from 'react'
import { Image } from 'expo-image'
import { assetSource } from '@/novel/preload'
import { StyleSheet, View } from 'react-native'

type Props = {
  name: string | null
  version: string | null
  hidden?: boolean
}

function isRight (name: string | null) {
  const base = name?.split('/').pop() ?? ''
  return base.startsWith('guy_')
}

function SpriteImage ({ name, version }: { name: string, version: string | null }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      source={assetSource(name, version)}
      style={[StyleSheet.absoluteFill, !loaded && styles.hidden]}
      contentFit={'contain'}
      onLoad={() => setLoaded(true)}
    />
  )
}

export default function Sprite ({ name, version, hidden = false }: Props) {
  const visible = name !== null && !hidden

  return (
    <View
      pointerEvents={'none'}
      style={[
        styles.sprite,
        isRight(name) ? styles.right : styles.left,
        !visible && styles.hidden,
      ]}
    >
      {name !== null && <SpriteImage key={name} name={name} version={version} />}
    </View>
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
