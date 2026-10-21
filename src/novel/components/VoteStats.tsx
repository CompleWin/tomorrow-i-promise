import { useEffect, useEffectEvent, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { getResults, Results } from '@/novel/vote'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

export const COUNTING = 'Считаем голоса...'

const CELLS = 50
const COUNT_MS = 1400

export function useVoteResults (key: string): Results | null | undefined {
  const [fetched, setFetched] = useState<{ key: string, results: Results | null } | null>(null)

  useEffect(() => {
    let cancelled = false
    getResults().then(results => {
      if (!cancelled) {
        setFetched({ key, results })
      }
    }).catch(error => {
      console.warn('failed to get results', error)
      if (!cancelled) {
        setFetched({ key, results: null })
      }
    })
    return () => { cancelled = true }
  }, [key])

  return fetched !== null && fetched.key === key ? fetched.results : undefined
}

export function resultsMessage (results: Results | null): string | null {
  if (results === null) {
    return 'Статистика сейчас недоступна'
  }
  if (results.a + results.b === 0) {
    return 'Пока никто не голосовал'
  }
  return null
}

type Props = {
  message: string | null
  results: Results | null
  onCounted?: () => void
}

export default function VoteStats ({ message, results, onCounted }: Props) {
  const [progress, setProgress] = useState(0)
  const statsIn = useSharedValue(0)
  const showStats = message === null && results !== null

  const counted = useEffectEvent(() => {
    onCounted?.()
  })

  useEffect(() => {
    if (!showStats) {
      return
    }
    statsIn.set(0)
    statsIn.set(withTiming(1, { duration: 500 }))

    const start = performance.now()
    let frame = 0
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / COUNT_MS)
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        counted()
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [showStats, statsIn])

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsIn.get(),
  }))

  const total = results === null ? 0 : results.a + results.b
  const percentA = results === null || total === 0 ? 0 : Math.round(results.a * 100 / total)
  const percentB = 100 - percentA
  const groupA = Math.round(percentA / 2)
  const groupB = CELLS - groupA
  const litA = Math.round(groupA * progress)
  const litB = Math.round(groupB * progress)

  return (
    <View style={styles.block}>
      {message !== null && (
        <View style={styles.message}>
          <UIText size={40} color={COLORS.cream2} align={'center'}>{message}</UIText>
        </View>
      )}

      {showStats && (
        <Animated.View style={[styles.stats, statsStyle]}>
          <View style={styles.numbers}>
            <View style={styles.side}>
              <UIText size={96} color={COLORS.cream}>{Math.round(percentA * progress)}%</UIText>
              <UIText size={28} spacing={0.06} color={COLORS.sub}>оставляем</UIText>
            </View>
            <UIText size={26} color={COLORS.muted} style={styles.total}>
              Всего голосов — {total.toLocaleString('ru-RU')}
            </UIText>
            <View style={[styles.side, styles.sideRight]}>
              <UIText size={96} color={COLORS.cream}>{Math.round(percentB * progress)}%</UIText>
              <UIText size={28} spacing={0.06} color={COLORS.sub}>не оставляем</UIText>
            </View>
          </View>

          <View style={styles.scale}>
            <View style={styles.group}>
              {Array.from({ length: groupA }, (_, i) => (
                <View key={i} style={[styles.cell, i < litA && styles.cellOn]} />
              ))}
            </View>
            <View style={styles.group}>
              {Array.from({ length: groupB }, (_, i) => (
                <View key={i} style={[styles.cell, i >= groupB - litB && styles.cellOn]} />
              ))}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    width: 1416,
    height: 250,
  },
  message: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    gap: 26,
  },
  numbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  side: {
    alignItems: 'flex-start',
    gap: 14,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  total: {
    paddingBottom: 2,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    height: 22,
  },
  group: {
    flexDirection: 'row',
    gap: 6,
  },
  cell: {
    width: 22,
    height: 22,
    backgroundColor: COLORS.cellOff,
  },
  cellOn: {
    backgroundColor: COLORS.cream,
  },
})
