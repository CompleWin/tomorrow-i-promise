import { router } from 'expo-router'
import Credits from '@/novel/components/Credits'
import { Stage } from '@/novel/components/Stage'

export default function CreditsScreen () {
  function done () {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <Stage>
      <Credits onDone={done} />
    </Stage>
  )
}
