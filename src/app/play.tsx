import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import useNovel from '@/novel/useNovel'
import useTypewriter from '@/novel/useTypewriter'
import Background from '@/novel/components/Background'
import ChoiceList from '@/novel/components/ChoiceList'
import End from '@/novel/components/End'
import MenuItem from '@/novel/components/MenuItem'
import { Stage } from '@/novel/components/Stage'
import Sprite from '@/novel/components/Sprite'
import Subtitles from '@/novel/components/Subtitles'
import UIText from '@/novel/components/UIText'
import { COLORS, EASE, TEXT_DELAY } from '@/novel/theme'

const GRADIENT_H = 470
const GRADIENT_OVERSCAN = 40
const GRADIENT_K = GRADIENT_H / (GRADIENT_H + GRADIENT_OVERSCAN)
const GRADIENT_COLORS = ['rgba(4,3,2,0)', 'rgba(4,3,2,.8)', 'rgba(4,3,2,.94)', 'rgba(4,3,2,.94)'] as const
const GRADIENT_LOCATIONS = [0, 0.52 * GRADIENT_K, GRADIENT_K, 1] as const

const SHAKE = {
  offsets: [0, 0.1, 0.22, 0.36, 0.52, 0.7, 1],
  x: [0, -9, 8, -6, 4, -2, 0],
  y: [0, 4, -5, 3, -2, 1, 0],
}

export default function Play () {
  const novel = useNovel()
  const [readyLine, setReadyLine] = useState(-1)
  const ready = readyLine === novel.lineId
  const typing = useTypewriter(novel.text, { key: novel.lineId, paused: !ready })
  const veiling = novel.fx === 'toBlack' && !ready

  const veil = useSharedValue(0)
  const shake = useSharedValue(1)
  const veilOn = useRef(false)
  const shownBg = useRef<string | null>(null)

  const veilStyle = useAnimatedStyle(() => ({
    opacity: veil.get(),
  }))
  const cameraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shake.get(), SHAKE.offsets, SHAKE.x) },
      { translateY: interpolate(shake.get(), SHAKE.offsets, SHAKE.y) },
    ],
  }))

  const startLine = useEffectEvent(() => {
    let wait = 0

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
    if (lineId === 0) {
      return
    }
    const timer = setTimeout(() => finishLine(lineId), startLine())
    return () => clearTimeout(timer)
  }, [novel.lineId])

  const tap = () => {
    if (!ready || novel.ended) {
      return
    }
    if (!typing.done) {
      typing.finish()
      return
    }
    if (novel.choices.length > 0) {
      return
    }
    novel.next()
  }

  if (novel.loading) {
    return (
      <Stage>
        <View style={styles.status}>
          <UIText size={30} color={COLORS.muted}>Загрузка...</UIText>
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

          <LinearGradient colors={GRADIENT_COLORS}
                          locations={GRADIENT_LOCATIONS}
                          pointerEvents={'none'}
                          style={styles.gradient}
          />

          <Subtitles speaker={veiling ? null : novel.speaker}
                     text={veiling ? '' : novel.text}
                     shown={typing.shown}
                     instant={novel.resumed}
                     intro
          />

          {typing.done && novel.choices.length > 0 && (
            <ChoiceList choices={novel.choices} onChoose={novel.choose} />
          )}

          {novel.ended && <End finalChoice={novel.finalChoice}
                               voteStatus={novel.voteStatus} />}
        </Animated.View>

        {novel.notice !== null && (
          <UIText size={34} color={COLORS.cream} style={styles.notice}>
            {novel.notice}
          </UIText>
        )}

        {novel.updateAvailable && (
          <Pressable style={styles.banner} onPress={novel.reload}>
            <UIText size={34} color={COLORS.cream}>Доступна новая версия истории.
              Обновить</UIText>
          </Pressable>
        )}

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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -GRADIENT_OVERSCAN,
    height: GRADIENT_H + GRADIENT_OVERSCAN,
  },
  notice: {
    position: 'absolute',
    top: '4%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 24,
  },
  banner: {
    position: 'absolute',
    top: '4%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 24,
  },
})
