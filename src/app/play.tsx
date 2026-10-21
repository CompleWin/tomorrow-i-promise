import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { BackHandler, Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import useNovel from '@/novel/useNovel'
import useTypewriter from '@/novel/useTypewriter'
import sleep from '@/novel/sleep'
import { clearSave, markCompleted } from '@/novel/storage'
import { assetUrl } from '@/novel/config'
import { playSfx, releaseSound, startSound, stopAll } from '@/novel/sound'
import Background from '@/novel/components/Background'
import { useBanner } from '@/novel/components/Banner'
import BottomGradient from '@/novel/components/BottomGradient'
import ChoicePlates from '@/novel/components/ChoicePlates'
import Credits from '@/novel/components/Credits'
import End from '@/novel/components/End'
import { useFade } from '@/novel/components/Fade'
import MenuItem from '@/novel/components/MenuItem'
import PauseButton from '@/novel/components/PauseButton'
import PauseOverlay from '@/novel/components/PauseOverlay'
import { Stage } from '@/novel/components/Stage'
import Sprite from '@/novel/components/Sprite'
import Subtitles from '@/novel/components/Subtitles'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE, TEXT_DELAY } from '@/novel/theme'

const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.8)', 'rgba(4,3,2,.94)'] as const

type Phase = 'play' | 'choice' | 'credits' | 'result'

const SHAKE = {
  offsets: [0, 0.1, 0.22, 0.36, 0.52, 0.7, 1],
  x: [0, -9, 8, -6, 4, -2, 0],
  y: [0, 4, -5, 3, -2, 1, 0],
}

export default function Play () {
  const novel = useNovel()
  const reload = novel.reload
  const fade = useFade()
  const banner = useBanner()
  const [readyLine, setReadyLine] = useState(-1)
  const [paused, setPaused] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [slowLoad, setSlowLoad] = useState(false)
  const [stagePhase, setStagePhase] = useState<Phase>('play')
  const phase: Phase = novel.ended && stagePhase !== 'credits' ? 'result' : stagePhase
  const ready = readyLine === novel.lineId
  const busy = leaving || updating
  const hasChoices = novel.choices.length > 0
  const alive = useRef(true)
  const typing = useTypewriter(novel.text, { key: novel.lineId, paused: !ready || paused || busy })
  const veiling = novel.fx === 'toBlack' && !ready

  const veil = useSharedValue(0)
  const shake = useSharedValue(1)
  const veilOn = useRef(false)
  const shownBg = useRef<string | null>(null)
  const reveal = useRef(true)
  const soundLine = useRef(0)

  const veilStyle = useAnimatedStyle(() => ({
    opacity: veil.get(),
  }))
  const cameraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shake.get(), SHAKE.offsets, SHAKE.x) },
      { translateY: interpolate(shake.get(), SHAKE.offsets, SHAKE.y) },
    ],
  }))

  function playLineSound (lineId: number, sfx: string | null) {
    if (sfx === null || soundLine.current === lineId) {
      return
    }
    soundLine.current = lineId
    playSfx(assetUrl(`sfx/${sfx}`, novel.version))
  }

  const startLine = useEffectEvent(() => {
    let wait = 0
    playLineSound(novel.lineId, novel.sfx)

    if (reveal.current) {
      reveal.current = false
      if (!slowLoad) {
        fade.set(1)
      }
      fade.to(0, novel.resumed ? 700 : 500)
    }

    if (novel.resumed) {
      veil.set(novel.dark ? 1 : 0)
      veilOn.current = novel.dark
      shownBg.current = novel.bg
    } else if (novel.fx === 'toBlack') {
      veil.set(withTiming(1, { duration: 1100, easing: EASE.inOut }))
      veilOn.current = true
      wait = 1100 + 500
    } else if (novel.bg !== null && novel.bg !== shownBg.current) {
      shownBg.current = novel.bg
      wait = TEXT_DELAY[novel.fx ?? 'default'] ?? TEXT_DELAY.default
      if (veilOn.current) {
        veil.set(withTiming(0, { duration: 900, easing: EASE.inOut }))
        veilOn.current = false
        wait = Math.max(wait, 500)
      }
    }

    if (novel.fx === 'shake') {
      shake.set(0)
      shake.set(withTiming(1, { duration: 620, easing: EASE.easeOut }))
    }

    return wait
  })

  const finishLine = useEffectEvent((lineId: number) => {
    if (novel.fx === 'toBlack' && novel.text === '') {
      novel.next()
      return
    }
    setReadyLine(lineId)
  })

  useEffect(() => {
    const lineId = novel.lineId
    if (lineId === 0 || novel.ended) {
      return
    }
    const timer = setTimeout(() => finishLine(lineId), startLine())
    return () => clearTimeout(timer)
  }, [novel.lineId, novel.ended])

  useEffect(() => {
    if (!fade.isBlack()) {
      fade.set(1)
    }
  }, [fade])

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  useEffect(() => {
    startSound()
    return () => releaseSound()
  }, [])

  useEffect(() => {
    if (!ready || !typing.done || !hasChoices) {
      return
    }
    const timer = setTimeout(() => setStagePhase('choice'), 500)
    return () => clearTimeout(timer)
  }, [ready, typing.done, hasChoices])

  useEffect(() => {
    if (!novel.loading) {
      return
    }
    const timer = setTimeout(() => {
      setSlowLoad(true)
      fade.to(0, 300)
    }, 300)
    return () => clearTimeout(timer)
  }, [novel.loading, fade])

  useEffect(() => {
    if (novel.error !== null) {
      fade.to(0, 300)
    }
  }, [novel.error, fade])

  useEffect(() => {
    if (novel.notice === null || novel.loading) {
      return
    }
    const id = banner.show(novel.notice, { duration: 3200 })
    return () => banner.hide(id)
  }, [novel.notice, novel.loading, banner])

  useEffect(() => {
    if (!novel.updateAvailable) {
      return
    }
    const id = banner.show('Доступна новая версия истории', {
      action: 'Обновить',
      onPress: () => {
        setPaused(false)
        setUpdating(true)
      },
    })
    return () => banner.hide(id)
  }, [novel.updateAvailable, banner])

  useEffect(() => {
    if (!updating) {
      return
    }
    let cancelled = false
    banner.hide()
    fade.to(1, 600).then(() => {
      if (cancelled) {
        return
      }
      reveal.current = true
      setStagePhase('play')
      setUpdating(false)
      reload()
    })
    return () => { cancelled = true }
  }, [updating, banner, fade, reload])

  useEffect(() => {
    if (phase === 'result' && novel.finalChoice !== null) {
      markCompleted(novel.finalChoice)
    }
  }, [phase, novel.finalChoice])

  const onBack = useEffectEvent(() => {
    if (novel.loading || novel.error !== null) {
      return false
    }
    if (!busy && phase !== 'credits') {
      setPaused(p => !p)
    }
    return true
  })

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack)
    return () => subscription.remove()
  }, [])

  async function toMenu () {
    setPaused(false)
    setLeaving(true)
    stopAll()
    await fade.to(1, 600)
    if (phase === 'result' && novel.voteStatus !== 'pending') {
      await clearSave()
    }
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const tap = () => {
    if (phase !== 'play' || !ready || paused || busy) {
      return
    }
    if (!typing.done) {
      typing.finish()
      return
    }
    if (hasChoices) {
      return
    }
    const shown = novel.next()
    if (shown !== null) {
      playLineSound(shown.lineId, shown.sfx)
    }
  }

  async function pick (index: number) {
    await sleep(1100)
    if (!alive.current) {
      return
    }
    await fade.to(1, 1500)
    if (!alive.current) {
      return
    }
    novel.choose(index)
    setStagePhase('credits')
  }

  if (novel.loading) {
    return (
      <Stage>
        <View style={styles.status}>
          {slowLoad && <UIText size={30} color={COLORS.muted}>Загрузка...</UIText>}
        </View>
      </Stage>
    )
  }
  if (novel.error) {
    return (
      <Stage>
        <View style={styles.status}>
          <UIText size={30} color={COLORS.muted}>Не удалось загрузить историю</UIText>
          <MenuItem label={'Повторить'} onPress={novel.reload} style={styles.retry} />
        </View>
      </Stage>
    )
  }

  return (
    <Pressable onPress={tap} style={styles.screen}>
      <Stage>
        {(phase === 'play' || phase === 'choice') && (
          <Animated.View style={[StyleSheet.absoluteFill, cameraStyle]}>
            <Background name={novel.bg}
                        fx={novel.fx}
                        instant={novel.resumed}
                        version={novel.version}
            />

            <Sprite name={novel.sprite}
                    version={novel.version}
                    hidden={novel.dark || veiling}
                    instant={novel.resumed}
            />

            <Animated.View pointerEvents={'none'} style={[styles.veil, veilStyle]} />

            <BottomGradient height={470} colors={GRADIENT} middle={0.52} />

            <Subtitles speaker={veiling ? null : novel.speaker}
                       text={veiling ? '' : novel.text}
                       shown={typing.shown}
                       instant={novel.resumed}
                       intro
            />

            {phase === 'choice' && hasChoices && (
              <ChoicePlates choices={novel.choices} onPick={pick} />
            )}
          </Animated.View>
        )}

        {phase === 'credits' && (
          <Credits onDone={() => setStagePhase('result')} />
        )}

        {phase === 'result' && (
          <End finalChoice={novel.finalChoice}
               voteStatus={novel.voteStatus}
               version={novel.version}
               onExit={toMenu}
          />
        )}

        {phase !== 'credits' && <PauseButton onPress={() => setPaused(true)} />}

        {paused && <PauseOverlay onResume={() => setPaused(false)} onMenu={toMenu} />}
      </Stage>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  status: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retry: {
    paddingLeft: 0,
    marginTop: 40,
  },
  veil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
})
