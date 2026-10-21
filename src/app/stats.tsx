import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { BackHandler, Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { cachedVersion } from '@/novel/content'
import sleep from '@/novel/sleep'
import { Completed, loadCompleted, loadSave } from '@/novel/storage'
import { LABELS } from '@/novel/vote'
import Background from '@/novel/components/Background'
import BottomGradient from '@/novel/components/BottomGradient'
import { useFade } from '@/novel/components/Fade'
import { Stage } from '@/novel/components/Stage'
import UIText from '@/novel/components/UIText'
import VoteStats, { COUNTING, resultsMessage, useVoteResults } from '@/novel/components/VoteStats'
import { COLORS } from '@/novel/theme'

const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.84)', 'rgba(4,3,2,.95)'] as const

type Info = {
  completed: Completed | null
  version: string | null
}

async function loadInfo (): Promise<Info> {
  const [save, completed] = await Promise.all([loadSave(), loadCompleted()])
  return {
    completed,
    version: save?.contentVersion ?? await cachedVersion(),
  }
}

export default function Stats () {
  const fade = useFade()
  const [info, setInfo] = useState<Info | null>(null)
  const [statusOn, setStatusOn] = useState(false)
  const [held, setHeld] = useState(false)
  const [counted, setCounted] = useState(false)
  const leaving = useRef(false)
  const results = useVoteResults('stats')

  useEffect(() => {
    let cancelled = false
    loadInfo().then(data => {
      if (!cancelled) {
        setInfo(data)
      }
    })

    async function intro () {
      if (!fade.isBlack()) {
        fade.set(1)
      }
      await fade.to(0, 700)
      if (cancelled) {
        return
      }
      setStatusOn(true)
      await sleep(1200)
      if (!cancelled) {
        setHeld(true)
      }
    }

    intro()
    return () => { cancelled = true }
  }, [fade])

  const message = !held || results === undefined ? COUNTING : resultsMessage(results)
  const showStats = statusOn && message === null
  const settled = showStats ? counted : statusOn && message !== COUNTING

  async function leave () {
    if (leaving.current) {
      return
    }
    leaving.current = true
    await fade.to(1, 600)
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const onBack = useEffectEvent(() => {
    leave()
    return true
  })

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack)
    return () => subscription.remove()
  }, [])

  const tap = () => {
    if (settled) {
      leave()
    }
  }

  const choice = info?.completed?.choice

  return (
    <Pressable onPress={tap} style={[styles.screen, !settled && styles.waiting]}>
      <Stage>
        {info !== null && <Background name={'bg3.png'} fx={null} instant version={info.version} />}
        <View style={styles.dim} />
        <BottomGradient height={720} colors={GRADIENT} middle={0.42} />

        <View style={styles.content}>
          <VoteStats message={statusOn ? message : null}
                     results={showStats ? results ?? null : null}
                     onCounted={() => setCounted(true)}
          />

          <View style={[styles.answer, choice === undefined && styles.hidden]}>
            <UIText size={34} spacing={0.06} color={COLORS.lamp}>Вы выбрали</UIText>
            <UIText size={56} lineHeight={1.3} color={COLORS.cream} shadow>
              {choice === undefined ? ' ' : LABELS[choice]}
            </UIText>
          </View>
        </View>
      </Stage>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  waiting: {
    cursor: 'auto',
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
  answer: {
    alignItems: 'center',
    gap: 22,
  },
  hidden: {
    opacity: 0,
  },
})
