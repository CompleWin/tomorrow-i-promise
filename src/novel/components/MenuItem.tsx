import { Pressable, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import UIText from '@/novel/components/UIText'
import LampDot from '@/novel/components/LampDot'
import { COLORS } from '@/novel/theme'

const SIZE = 52
const DOT = 14
const GAP = 22

type Props = {
  label: string
  active?: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export default function MenuItem ({ label, active = false, onPress, style }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Pressable onPress={onPress}
               onHoverIn={() => setHovered(true)}
               onHoverOut={() => setHovered(false)}
               style={[styles.item, style]}
    >
      {({ pressed }) => (
        <>
          {active && (
            <View style={styles.dot}>
              <LampDot />
            </View>
          )}
          <UIText size={SIZE}
                  color={active || hovered || pressed ? COLORS.lamp : COLORS.cream2}
          >
            {label}
          </UIText>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
    paddingLeft: DOT + GAP,
  },
  dot: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -DOT / 2,
  },
})
