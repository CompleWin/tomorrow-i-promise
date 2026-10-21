import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Choice, getResults, Results } from '@/novel/vote'
import { VoteStatus } from '@/novel/storage'
import useTypewriter from '@/novel/useTypewriter'
import sleep from '@/novel/sleep'
import Background from '@/novel/components/Background'
import BottomGradient from '@/novel/components/BottomGradient'
import { useFade } from '@/novel/components/Fade'
import TypedText from '@/novel/components/TypedText'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

const LABELS: Record<Choice, string> = {
  A: 'Оставляем',
  B: 'Не оставляем',
}

const CELLS = 50
const COUNT_MS = 1400
const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.84)', 'rgba(4,3,2,.95)'] as const

type Props = {
  finalChoice: Choice | null
  voteStatus: VoteStatus
  version: string | null
}

type Fetched = {
  status: VoteStatus
  results: Results | null
}

export default function End ({ finalChoice, voteStatus, version }: Props) {
  const fade = useFade()
  const [lit, setLit] = useState(false)
  const [typingOn, setTypingOn] = useState(false)
  const [statusOn, setStatusOn] = useState(false)
  const [held, setHeld] = useState(false)
  const [fetched, setFetched] = useState<Fetched | null>(null)
  const [progress, setProgress] = useState(0)
  const statsIn = useSharedValue(0)

  const answer = finalChoice === null ? '' : LABELS[finalChoice]
  const typing = useTypewriter(answer, { key: 1, paused: !typingOn })

  useEffect(() => {
    let cancelled = false
    fade.set(0)

    async function intro () {
      await sleep(600)
      if (cancelled) {
        return
      }
      setLit(true)
      await sleep(1400)
      if (!cancelled) {
        setTypingOn(true)
      }
    }

    intro()
    return () => { cancelled = true }
  }, [fade])

  useEffect(() => {
    if (!typingOn || !typing.done) {
      return
    }
    const timer = setTimeout(() => setStatusOn(true), 600)
    return () => clearTimeout(timer)
  }, [typingOn, typing.done])

  useEffect(() => {
    if (!statusOn) {
      return
    }
    const timer = setTimeout(() => setHeld(true), 1200)
    return () => clearTimeout(timer)
  }, [statusOn])

  useEffect(() => {
    let cancelled = false
    getResults().then(results => {
      if (!cancelled) {
        setFetched({ status: voteStatus, results })
      }
    }).catch(error => {
      console.warn('failed to get results', error)
      if (!cancelled) {
        setFetched({ status: voteStatus, results: null })
      }
    })
    return () => { cancelled = true }
  }, [voteStatus])

  const current = fetched !== null && fetched.status === voteStatus ? fetched : null

  let message: string | null = null
  let percentA = 0
  let total = 0
  if (voteStatus === 'pending') {
    message = 'Голос будет учтён, когда появится связь'
  } else if (!held || current === null) {
    message = 'Считаем голоса...'
  } else if (current.results === null) {
    message = 'Статистика сейчас недоступна'
  } else {
    total = current.results.a + current.results.b
    if (total === 0) {
      message = 'Пока никто не голосовал'
    } else {
      percentA = Math.round(current.results.a * 100 / total)
    }
  }
  const showStats = statusOn && message === null

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
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [showStats, statsIn])

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsIn.get(),
  }))

  const percentB = 100 - percentA
  const groupA = Math.round(percentA / 2)
  const groupB = CELLS - groupA
  const litA = Math.round(groupA * progress)
  const litB = Math.round(groupB * progress)

  return (
    <View style={styles.screen}>
      <Background name={lit ? 'bg3.png' : null} fx={'lightsOn'} version={version} />
      <View style={styles.dim} />
      <BottomGradient height={720} colors={GRADIENT} middle={0.42} />

      <View style={styles.content}>
        <View style={styles.block}>
          {statusOn && message !== null && (
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

        <View style={styles.answer}>
          <UIText size={34} spacing={0.06} color={COLORS.lamp} style={!typingOn && styles.hidden}>
            Вы выбрали
          </UIText>
          <UIText size={56} lineHeight={1.3} color={COLORS.cream} shadow>
            <TypedText text={answer} shown={typing.shown} />
          </UIText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.resultDim,
  },
  content: {
    position: 'absolute',
    left: 240,
    right: 240,
    bottom: 76,
    alignItems: 'center',
    gap: 72,
  },
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
  answer: {
    alignItems: 'center',
    gap: 22,
  },
  hidden: {
    opacity: 0,
  },
})
