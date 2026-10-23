import { Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

const SIZE = 52

type Props = {
  label: string
  selected?: boolean
  onHover?: () => void
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export default function MenuItem ({ label, selected, onHover, onPress, style }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Pressable onPress={onPress}
               onHoverIn={() => {
                 setHovered(true)
                 onHover?.()
               }}
               onHoverOut={() => setHovered(false)}
               style={[styles.item, style]}
    >
      {({ pressed }) => (
        <UIText size={SIZE}
                color={(selected ?? hovered) || pressed ? COLORS.lamp : COLORS.cream2}
        >
          {label}
        </UIText>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
  },
})
