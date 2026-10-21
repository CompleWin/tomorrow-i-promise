import { useRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
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
import { COLORS } from '@/novel/theme'

const GRADIENT_COLORS = ['rgba(4,3,2,0)', 'rgba(4,3,2,.8)', 'rgba(4,3,2,.94)'] as const
const GRADIENT_LOCATIONS = [0, 0.52, 1] as const

export default function Play () {
  const novel = useNovel()
  const typing = useTypewriter(novel.text, { key: novel.lineId })
  const busy = useRef(false)

  const tap = () => {
    if (busy.current || novel.ended) {
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
        <View style={StyleSheet.absoluteFill}>
          <Background name={novel.bg}
                      version={novel.version}
          />

          <Sprite name={novel.sprite}
                  version={novel.version}
          />

          <LinearGradient colors={GRADIENT_COLORS}
                          locations={GRADIENT_LOCATIONS}
                          pointerEvents={'none'}
                          style={styles.gradient}
          />

          <Subtitles speaker={novel.speaker}
                     text={novel.text}
                     shown={typing.shown}
          />

          {typing.done && novel.choices.length > 0 && (
            <ChoiceList choices={novel.choices} onChoose={novel.choose} />
          )}

          {novel.ended && <End finalChoice={novel.finalChoice}
                               voteStatus={novel.voteStatus} />}
        </View>

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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 470,
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
