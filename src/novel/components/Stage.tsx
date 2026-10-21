import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

export const STAGE_W = 1920
export const STAGE_H = 1080

const noop = () => () => {}

function useHydrated () {
  return useSyncExternalStore(noop, () => true, () => false)
}

export function useStageScale () {
  const screen = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const hydrated = useHydrated()

  const width = hydrated ? screen.width : 0
  const height = hydrated ? screen.height : 0
  const availW = width - insets.left - insets.right
  const availH = height - insets.top - insets.bottom
  const k = Math.max(0, Math.min(availW / STAGE_W, availH / STAGE_H))

  return {
    k,
    left: insets.left + (availW - STAGE_W * k) / 2,
    top: insets.top + (availH - STAGE_H * k) / 2,
  }
}

export function Stage ({ children }: { children: ReactNode }) {
  const { k, left, top } = useStageScale()
  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { left, top, transform: [{ scale: k }] }]}>
        {children}
      </View>
    </View>
  )
}

export function StageOverlay ({ children }: { children: ReactNode }) {
  const { k, left, top } = useStageScale()
  return (
    <View style={styles.overlay}>
      <View style={[styles.inner, styles.passThrough, { left, top, transform: [{ scale: k }] }]}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    pointerEvents: 'box-none',
  },
  passThrough: {
    pointerEvents: 'box-none',
  },
  outer: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  inner: {
    position: 'absolute',
    width: STAGE_W,
    height: STAGE_H,
    transformOrigin: 'top left',
    overflow: 'hidden',
  },
})
