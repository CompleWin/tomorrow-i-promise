import { useState } from 'react'
import { Linking, Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { REPO_URL } from '@/novel/credits'
import { useLocale } from '@/novel/components/Locale'
import UIText from '@/novel/components/UIText'
import { COLORS, IDLE_OPACITY } from '@/novel/theme'

export default function GitHubStar () {
  const { t } = useLocale()
  const [hovered, setHovered] = useState(false)

  return (
    <View pointerEvents={'box-none'} style={styles.block}>
      <UIText size={34} spacing={0.04} color={COLORS.sub} align={'center'}>
        {t.githubStar}
      </UIText>
      <Pressable onPress={() => Linking.openURL(REPO_URL)}
                 onHoverIn={() => setHovered(true)}
                 onHoverOut={() => setHovered(false)}
                 accessibilityRole={'link'}
                 accessibilityLabel={t.github}
      >
        {({ pressed }) => (
          <Image source={require('@/assets/ui/github.svg')}
                 style={[styles.logo, { opacity: hovered || pressed ? 1 : 1 - IDLE_OPACITY / 2 }]}
          />
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
})
