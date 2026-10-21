import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { ReactNode } from 'react'

export const STAGE_W = 1920
export const STAGE_H = 1080

export function useStageScale () {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const availW = width - insets.left - insets.right
  const availH = height - insets.top - insets.bottom
  const k = Math.min(availW / STAGE_W, availH / STAGE_H)

  return {
    k,
    left: insets.left + (availW - STAGE_W * k) / 2,
    top: insets.top + (availH - STAGE_H * k) / 2,
  }
}

export function useStageSize () {
  return { w: STAGE_W, h: STAGE_H }
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

const styles = StyleSheet.create({
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
