import { StyleSheet, useWindowDimensions, View } from 'react-native'
import type { ReactNode } from 'react'

const RATIO = 1672 / 941

export function useStageSize () {
  const { width, height } = useWindowDimensions()

  const w = Math.min(width, height * RATIO)
  const h = w / RATIO

  return { w, h }
}

export function Stage ({ children }: { children: ReactNode }) {
  const { w, h } = useStageSize()
  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { width: w, height: h }]}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  inner: {
    overflow: 'hidden',
  },
})