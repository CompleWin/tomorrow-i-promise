import { Pressable, StyleSheet } from 'react-native'
import useNovel from '@/novel/useNovel'
import Background from '@/novel/components/Background'
import ChoiceList from '@/novel/components/ChoiceList'
import TextBox from '@/novel/components/TextBox'
import End from '@/novel/components/End'
import { Stage } from '@/novel/components/Stage'
import Sprite from '@/novel/components/Sprite'
import TextBoxFrame from '@/novel/components/TextBoxFrame'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

export default function Play () {
  const novel = useNovel()

  if (novel.loading) {
    return (
      <Stage>
        <UIText size={40} color={COLORS.cream} style={styles.status}>Загрузка...</UIText>
      </Stage>
    )
  }
  if (novel.error) {
    return (
      <Stage>
        <UIText size={40} color={COLORS.cream} style={styles.status}>Ошибка: {novel.error}</UIText>
      </Stage>
    )
  }

  const isSprite = novel.sprite !== null
  return (
    <Pressable onPress={novel.next} style={styles.screen}>
      <Stage>
        <Background name={novel.bg}
                    version={novel.version}
        />

        <TextBoxFrame version={novel.version} />

        <Sprite name={novel.sprite}
                version={novel.version}
        />

        {novel.text !== '' && (
          <TextBox speaker={novel.speaker}
                   text={novel.text}
                   isSprite={isSprite}
          />
        )}

        {novel.choices.length > 0 && (
          <ChoiceList choices={novel.choices} onChoose={novel.choose} />
        )}

        {novel.ended && <End finalChoice={novel.finalChoice}
                             voteStatus={novel.voteStatus} />}

        {novel.notice !== null && (
          <UIText size={34} color={COLORS.cream} style={styles.notice}>
            {novel.notice}
          </UIText>
        )}

        {novel.updateAvailable && (
          <Pressable style={styles.banner} onPress={novel.update}>
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
    marginTop: 500,
    textAlign: 'center',
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