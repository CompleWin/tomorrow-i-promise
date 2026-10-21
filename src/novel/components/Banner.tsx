import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Image } from 'expo-image'
import UIText from '@/novel/components/UIText'
import { StageOverlay } from '@/novel/components/Stage'
import { COLORS, EASE } from '@/novel/theme'

type Props = {
  text: string
  action?: string
  onPress?: () => void
  visible: boolean
}

export default function Banner ({ text, action, onPress, visible }: Props) {
  const height = useSharedValue(200)
  const shift = useSharedValue(1)

  useEffect(() => {
    if (visible) {
      shift.set(1)
      shift.set(withTiming(0, { duration: 600, easing: EASE.out }))
    } else {
      shift.set(withTiming(1, { duration: 420, easing: EASE.easeIn }))
    }
  }, [visible, text, shift])

  const plateStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -2.2 * height.get() * shift.get() }],
  }))

  return (
    <View style={styles.wrap}>
      <Animated.View onLayout={e => height.set(e.nativeEvent.layout.height)}
                     style={[plateStyle, { pointerEvents: visible && onPress ? 'auto' : 'none' }]}
      >
        <Pressable onPress={onPress} style={styles.plate}>
          <Image source={require('@/assets/ui/brush_red.png')}
                 contentFit={'fill'}
                 style={StyleSheet.absoluteFill}
          />
          <UIText size={34} lineHeight={1.4} color={COLORS.cream} numberOfLines={1} style={styles.line}>{text}</UIText>
          {action !== undefined && (
            <View style={styles.action}>
              <UIText size={34} lineHeight={1.4} color={COLORS.lamp} numberOfLines={1} style={styles.line}>{action}</UIText>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  )
}

type BannerOptions = {
  action?: string
  onPress?: () => void
  duration?: number
}

type BannerState = BannerOptions & {
  id: number
  text: string
  visible: boolean
}

type BannerApi = {
  show: (text: string, options?: BannerOptions) => number
  hide: (id?: number) => void
}

const BannerContext = createContext<BannerApi | null>(null)

export function useBanner (): BannerApi {
  const banner = useContext(BannerContext)
  if (banner === null) {
    throw new Error('useBanner outside BannerProvider')
  }
  return banner
}

export function BannerProvider ({ children }: { children: ReactNode }) {
  const [banner, setBanner] = useState<BannerState>({ id: 0, text: '', visible: false })
  const lastId = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
    }
  }, [])

  const api = useMemo<BannerApi>(() => {
    const hide = (id?: number) => {
      setBanner(b => id === undefined || b.id === id ? { ...b, visible: false } : b)
    }
    const show = (text: string, { action, onPress, duration }: BannerOptions = {}) => {
      const id = ++lastId.current
      if (timer.current !== null) {
        clearTimeout(timer.current)
        timer.current = null
      }
      setBanner({ id, text, action, onPress, visible: true })
      if (duration !== undefined) {
        timer.current = setTimeout(() => hide(id), duration)
      }
      return id
    }
    return { show, hide }
  }, [])

  return (
    <BannerContext value={api}>
      {children}
      <StageOverlay>
        <Banner text={banner.text}
                action={banner.action}
                onPress={banner.onPress}
                visible={banner.visible}
        />
      </StageOverlay>
    </BannerContext>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 40,
    pointerEvents: 'box-none',
  },
  plate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    paddingTop: 32,
    paddingHorizontal: 72,
    paddingBottom: 36,
  },
  line: {
    marginVertical: -7,
  },
  action: {
    paddingBottom: 8,
    marginBottom: -10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lamp,
  },
})
