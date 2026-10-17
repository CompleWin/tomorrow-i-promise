import { Text, Button, Pressable } from 'react-native'
import { useNovel } from '@/novel/useNovel'

export default function Index() {
  const novel = useNovel()

  if (novel.loading) {
    return <Text>Загрузка...</Text>
  }
  if (novel.error) {
    return <Text>Ошибка: {novel.error}</Text>
  }

  return (
    <Pressable onPress={novel.next} style={{ flex: 1, padding: 20}}>
      <Text>bg: {novel.bg}</Text>
      <Text>{novel.speaker ?? '(автор)'}</Text>
      <Text>{novel.text}</Text>
      {novel.choices.map(c => (
        <Button key={c.index} title={c.text} onPress={() => novel.choose(c.index)}/>
      ))}
      {novel.ended && <Text>Конец</Text>}
    </Pressable>
  );
}