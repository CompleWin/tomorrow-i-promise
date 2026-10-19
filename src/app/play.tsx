import { Pressable, StyleSheet, Text } from 'react-native'
import useNovel from '@/novel/useNovel'
import Background from '@/novel/components/Background'
import ChoiceList from '@/novel/components/ChoiceList'
import TextBox from '@/novel/components/TextBox'
import End from '@/novel/components/End'
import { Stage } from '@/novel/components/Stage'
import Sprite from '@/novel/components/Sprite'
import TextBoxFrame from '@/novel/components/TextBoxFrame'

export default function Play () {
  const novel = useNovel()

  if (novel.loading) {
    return <Text>Загрузка...</Text>
  }
  if (novel.error) {
    return <Text>Ошибка: {novel.error}</Text>
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

        {novel.ended && <End />}

        {novel.notice !== null && (
          <Text style={styles.notice}>
            {novel.notice}
          </Text>
        )}

        {novel.updateAvailable && (
          <Pressable style={styles.banner} onPress={novel.update}>
            <Text style={styles.bannerText}>Доступна новая версия истории.
              Обновить</Text>
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
  notice: {
    position: 'absolute',
    top: '4%',
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  banner: {
    position: 'absolute',
    top: '4%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  bannerText: {
    color: '#fff',
  },
})