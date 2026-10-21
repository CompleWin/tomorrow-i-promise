import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Choice, LABELS } from '@/novel/vote'
import { VoteStatus } from '@/novel/storage'
import useTypewriter from '@/novel/useTypewriter'
import sleep from '@/novel/sleep'
import Background from '@/novel/components/Background'
import BottomGradient from '@/novel/components/BottomGradient'
import { useFade } from '@/novel/components/Fade'
import TypedText from '@/novel/components/TypedText'
import UIText from '@/novel/components/UIText'
import VoteStats, { COUNTING, resultsMessage, useVoteResults } from '@/novel/components/VoteStats'
import { COLORS } from '@/novel/theme'

const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.84)', 'rgba(4,3,2,.95)'] as const

type Props = {
  finalChoice: Choice | null
  voteStatus: VoteStatus
  version: string | null
  onExit: () => void
}

export default function End ({ finalChoice, voteStatus, version, onExit }: Props) {
  const fade = useFade()
  const [lit, setLit] = useState(false)
  const [typingOn, setTypingOn] = useState(false)
  const [statusOn, setStatusOn] = useState(false)
  const [held, setHeld] = useState(false)
  const [counted, setCounted] = useState(false)
  const exiting = useRef(false)

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

  const results = useVoteResults(voteStatus)

  let message: string | null
  if (voteStatus === 'pending') {
    message = 'Голос будет учтён, когда появится связь'
  } else if (!held || results === undefined) {
    message = COUNTING
  } else {
    message = resultsMessage(results)
  }
  const showStats = statusOn && message === null
  const settled = showStats ? counted : statusOn && message !== COUNTING

  const tap = () => {
    if (!settled || exiting.current) {
      return
    }
    exiting.current = true
    onExit()
  }

  return (
    <Pressable onPress={tap} style={[styles.screen, !settled && styles.waiting]}>
      <Background name={lit ? 'act1/bg/bg3.png' : null} fx={'lightsOn'} version={version} />
      <View style={styles.dim} />
      <BottomGradient height={720} colors={GRADIENT} middle={0.42} />

      <View style={styles.content}>
        <VoteStats message={statusOn ? message : null}
                   results={showStats ? results ?? null : null}
                   onCounted={() => setCounted(true)}
        />

        <View style={styles.answer}>
          <UIText size={34} spacing={0.06} color={COLORS.lamp} style={!typingOn && styles.hidden}>
            Вы выбрали
          </UIText>
          <UIText size={56} lineHeight={1.3} color={COLORS.cream} shadow>
            <TypedText text={answer} shown={typing.shown} />
          </UIText>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
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
