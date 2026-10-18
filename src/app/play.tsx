import { Pressable, StyleSheet, Text } from 'react-native'
import { useNovel } from '@/novel/useNovel'
import { Background } from '@/novel/components/Background'
import { ChoiceList } from '@/novel/components/ChoiceList'
import { TextBox } from '@/novel/components/TextBox'
import End from '@/novel/components/End'

export default function Play () {
  const novel = useNovel()

  if (novel.loading) {
    return <Text>Загрузка...</Text>
  }
  if (novel.error) {
    return <Text>Ошибка: {novel.error}</Text>
  }
  return (
    <Pressable onPress={novel.next} style={styles.screen}>
      <Background name={novel.bg} />
      {novel.choices.length > 0 && <ChoiceList choices={novel.choices} onChoose={novel.choose}/>}
      {novel.text !== '' && <TextBox speaker={novel.speaker} text={novel.text}/>}
      {novel.ended && <End/>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000'
  }
})