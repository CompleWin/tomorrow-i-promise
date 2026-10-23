import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { cachedVersion } from '@/novel/content'
import { loadSave } from '@/novel/storage'
import Credits from '@/novel/components/Credits'
import EndingBackdrop from '@/novel/components/EndingBackdrop'
import { useFade } from '@/novel/components/Fade'
import { Stage } from '@/novel/components/Stage'

export default function CreditsScreen () {
  const fade = useFade()
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadSave().then(async save => {
      const found = save?.contentVersion ?? await cachedVersion()
      if (!cancelled) {
        setVersion(found)
      }
    })
    return () => { cancelled = true }
  }, [])

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
      <EndingBackdrop version={version} />
      <Credits onDone={done} />
    </Stage>
  )
}
