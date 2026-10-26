import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { cachedVersion } from '@/novel/content'
import { loadCompleted, loadSave } from '@/novel/storage'
import Credits from '@/novel/components/Credits'
import EndingBackdrop from '@/novel/components/EndingBackdrop'
import { useFade } from '@/novel/components/Fade'
import { useLocale } from '@/novel/components/Locale'
import { Stage } from '@/novel/components/Stage'

export default function CreditsScreen () {
  const fade = useFade()
  const { lang } = useLocale()
  const [version, setVersion] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([loadSave(), loadCompleted()]).then(async ([save, done]) => {
      const found = save?.contentVersion ?? await cachedVersion(lang)
      if (!cancelled) {
        setVersion(found)
        setCompleted(done !== null)
      }
    })
    return () => { cancelled = true }
  }, [lang])

  async function done () {
    await fade.to(1, 700)
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <Stage>
      {completed && <EndingBackdrop version={version} />}
      <Credits onDone={done} />
    </Stage>
  )
}
