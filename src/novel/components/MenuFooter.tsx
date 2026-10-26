import { useState } from 'react'
import { Linking, Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { REPO_URL } from '@/novel/credits'
import { useLocale } from '@/novel/components/Locale'
import UIText from '@/novel/components/UIText'
import { COLORS, IDLE_OPACITY } from '@/novel/theme'

export default function MenuFooter ({ version }: { version: string | null }) {
  const { t } = useLocale()
  const [hovered, setHovered] = useState(false)

  return (
    <View pointerEvents={'box-none'} style={styles.footer}>
      {version !== null && (
        <UIText size={24} spacing={0.04} color={COLORS.cream} style={[styles.corner, styles.version]}>
          version: {version}
        </UIText>
      )}
      <Pressable onPress={() => Linking.openURL(REPO_URL)}
                 onHoverIn={() => setHovered(true)}
                 onHoverOut={() => setHovered(false)}
                 accessibilityRole={'link'}
                 accessibilityLabel={t.github}
                 hitSlop={12}
                 style={[styles.corner, styles.github]}
      >
        {({ pressed }) => (
          <Image source={require('@/assets/ui/github.svg')}
                 style={[styles.logo, { opacity: hovered || pressed ? 1 : IDLE_OPACITY }]}
          />
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    ...StyleSheet.absoluteFill,
  },
  corner: {
    position: 'absolute',
    bottom: 40,
  },
  version: {
    left: 48,
    opacity: IDLE_OPACITY,
  },
  github: {
    right: 48,
  },
  logo: {
    width: 52,
    height: 52,
  },
})
