import { Pressable, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import { COLORS, IDLE_OPACITY } from '@/novel/theme'

export default function PauseButton ({ onPress }: { onPress: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Pressable onPress={onPress}
               onHoverIn={() => setHovered(true)}
               onHoverOut={() => setHovered(false)}
               style={styles.zone}
    >
      {({ pressed }) => (
        <View style={[styles.square, (hovered || pressed) && styles.squarePressed]}>
          <View style={styles.bar} />
          <View style={styles.bar} />
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  zone: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingVertical: 30,
    paddingHorizontal: 34,
  },
  square: {
    width: 72,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.pauseBtn,
    opacity: IDLE_OPACITY,
  },
  squarePressed: {
    backgroundColor: COLORS.pauseBtnPressed,
    opacity: 1,
  },
  bar: {
    width: 12,
    height: 30,
    backgroundColor: COLORS.cream,
  },
})
