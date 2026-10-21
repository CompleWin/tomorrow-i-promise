import { StyleSheet, Text } from 'react-native'
import type { ReactNode } from 'react'
import type { StyleProp, TextStyle } from 'react-native'
import { FONT } from '@/novel/theme'

type Props = {
  size: number
  color: string
  spacing?: number
  lineHeight?: number
  shadow?: boolean
  upper?: boolean
  align?: TextStyle['textAlign']
  numberOfLines?: number
  style?: StyleProp<TextStyle>
  children: ReactNode
}

export default function UIText ({
  size,
  color,
  spacing = 0,
  lineHeight = 1,
  shadow = false,
  upper = false,
  align,
  numberOfLines,
  style,
  children,
}: Props) {
  return (
    <Text numberOfLines={numberOfLines}
          style={[
            styles.text,
            {
              fontSize: size,
              lineHeight: size * lineHeight,
              letterSpacing: spacing * size,
              color,
              textAlign: align,
            },
            upper && styles.upper,
            shadow && styles.shadow,
            style,
          ]}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT,
  },
  upper: {
    textTransform: 'uppercase',
  },
  shadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0.01,
  },
})
