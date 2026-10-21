import { useEffect, useState } from 'react'
import { Linking, Pressable, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { REPO_URL } from '@/novel/credits'
import UIText from '@/novel/components/UIText'
import { COLORS, IDLE_OPACITY } from '@/novel/theme'

type Props = {
  visible: boolean
}

export default function GitHubStar ({ visible }: Props) {
  const [hovered, setHovered] = useState(false)
  const shown = useSharedValue(0)

  useEffect(() => {
    shown.set(withTiming(visible ? 1 : 0, { duration: 600 }))
  }, [visible, shown])

  const style = useAnimatedStyle(() => ({
    opacity: shown.get(),
  }))

  return (
    <Animated.View pointerEvents={visible ? 'box-none' : 'none'} style={[styles.block, style]}>
      <UIText size={30} spacing={0.04} color={COLORS.sub} align={'center'}>
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
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    width: 72,
    height: 72,
  },
})
