import { useState } from 'react'
import { Linking, Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { REPO_URL } from '@/novel/credits'
import UIText from '@/novel/components/UIText'
import { COLORS, IDLE_OPACITY } from '@/novel/theme'

export default function GitHubStar () {
  const [hovered, setHovered] = useState(false)

  return (
    <View pointerEvents={'box-none'} style={styles.block}>
      <UIText size={34} spacing={0.04} color={COLORS.sub} align={'center'}>
        Будем благодарны, если вы поставите звезду на GitHub
      </UIText>
      <Pressable onPress={() => Linking.openURL(REPO_URL)}
                 onHoverIn={() => setHovered(true)}
                 onHoverOut={() => setHovered(false)}
                 accessibilityRole={'link'}
                 accessibilityLabel={'Репозиторий на GitHub'}
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
