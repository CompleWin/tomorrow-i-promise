import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { BackHandler, Pressable, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import useNovel, { Line } from '@/novel/useNovel'
import useTypewriter from '@/novel/useTypewriter'
import useKeys from '@/novel/useKeys'
import sleep from '@/novel/sleep'
import { clearSave, markCompleted } from '@/novel/storage'
import { assetUrl } from '@/novel/config'
import { playLoops, playMusic, playSfx, preloadSounds, releaseSound, startSound, stopAll, stopSfx } from '@/novel/sound'
import Background from '@/novel/components/Background'
import { useBanner } from '@/novel/components/Banner'
import BottomGradient from '@/novel/components/BottomGradient'
import ChoicePlates from '@/novel/components/ChoicePlates'
import Credits from '@/novel/components/Credits'
import End from '@/novel/components/End'
import EndingBackdrop from '@/novel/components/EndingBackdrop'
import { useFade } from '@/novel/components/Fade'
import MenuItem from '@/novel/components/MenuItem'
import PauseButton from '@/novel/components/PauseButton'
import PauseOverlay from '@/novel/components/PauseOverlay'
import { Stage } from '@/novel/components/Stage'
import Sprite from '@/novel/components/Sprite'
import Subtitles from '@/novel/components/Subtitles'
import Thanks from '@/novel/components/Thanks'
import UIText from '@/novel/components/UIText'
import { BG_DURATION, COLORS, EASE, TEXT_DELAY } from '@/novel/theme'

const GRADIENT = ['rgba(4,3,2,0)', 'rgba(4,3,2,.8)', 'rgba(4,3,2,.94)'] as const

type Phase = 'play' | 'choice' | 'credits' | 'thanks' | 'result'

const SHAKE = {
  offsets: [0, 0.1, 0.22, 0.36, 0.52, 0.7, 1],
  x: [0, -9, 8, -6, 4, -2, 0],
  y: [0, 4, -5, 3, -2, 1, 0],
}

export default function Play () {
  const { act } = useLocalSearchParams<{ act?: string }>()
  const novel = useNovel(__DEV__ ? act : undefined)
  const reload = novel.reload
  const fade = useFade()
  const banner = useBanner()
  const [readyLine, setReadyLine] = useState(-1)
  const [paused, setPaused] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [slowLoad, setSlowLoad] = useState(false)
  const [stagePhase, setStagePhase] = useState<Phase>('play')
  const outro = stagePhase === 'credits' || stagePhase === 'thanks'
  const phase: Phase = novel.ended && !outro ? 'result' : stagePhase
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

  function playLineSound (line: Pick<Line, 'lineId' | 'sfx' | 'music' | 'loops' | 'silence'>) {
    playMusic(line.music === null ? null : assetUrl(line.music, novel.version))
    playLoops(line.loops.map(loop => assetUrl(loop, novel.version)))
    if (soundLine.current === line.lineId) {
      return
    }
    soundLine.current = line.lineId
    if (line.silence) {
      stopSfx()
    }
    if (line.sfx !== null) {
      playSfx(assetUrl(line.sfx, novel.version))
    }
  }

  const startLine = useEffectEvent(() => {
    let wait = 0
    playLineSound(novel)

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
      const delays = novel.text === '' ? BG_DURATION : TEXT_DELAY
      wait = delays[novel.fx ?? 'default'] ?? delays.default
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

    return wait + novel.wait
  })

  const finishLine = useEffectEvent((lineId: number) => {
    if (novel.text === '' && !hasChoices) {
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
    if (novel.ended) {
      playMusic(novel.music === null ? null : assetUrl(novel.music, novel.version))
    }
  }, [novel.ended, novel.music, novel.version])

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

  const preloadChoiceMusic = useEffectEvent(() => {
    const urls = novel.choices.flatMap(choice => {
      const music = novel.choiceMusic(choice.index)
      return music === null ? [] : [assetUrl(music, novel.version)]
    })
    preloadSounds(urls)
  })

  useEffect(() => {
    if (hasChoices) {
      preloadChoiceMusic()
    }
  }, [hasChoices])

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

  function togglePause () {
    if (novel.loading || novel.error !== null) {
      return false
    }
    if (!busy && !outro) {
      setPaused(p => !p)
    }
    return true
  }

  const onBack = useEffectEvent(togglePause)

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
    playLineSound(novel)
    if (!typing.done) {
      typing.finish()
      return
    }
    if (hasChoices) {
      return
    }
    const shown = novel.next()
    if (shown !== null) {
      playLineSound(shown)
    }
  }

  useKeys({ onNext: tap, onPause: togglePause })

  async function pick (index: number) {
    const music = novel.choiceMusic(index)
    playMusic(music === null ? null : assetUrl(music, novel.version))
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

            <Animated.View pointerEvents={'none'} style={[styles.veil, veilStyle]} />

            <Sprite name={novel.sprite}
                    version={novel.version}
                    hidden={veiling}
                    instant={novel.resumed}
            />

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

        {(outro || phase === 'result') && <EndingBackdrop version={novel.version} result={phase === 'result'} />}

        {phase === 'credits' && (
          <Credits onDone={() => setStagePhase('thanks')} />
        )}

        {phase === 'thanks' && (
          <Thanks onDone={() => setStagePhase('result')} />
        )}

        {phase === 'result' && (
          <End finalChoice={novel.finalChoice}
               voteStatus={novel.voteStatus}
               onExit={toMenu}
          />
        )}

        {!outro && <PauseButton onPress={() => setPaused(true)} />}

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
