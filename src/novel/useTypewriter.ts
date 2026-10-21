import { useEffect, useState } from 'react'
import { TEXT_SPEED, TYPE_DELAY } from '@/novel/theme'

type Options = {
  key: number
  paused?: boolean
  startDelay?: number
}

const STOPS = '.!?…'
const PAUSES = ',—:;'

function delayAfter (ch: string) {
  if (STOPS.includes(ch)) {
    return TYPE_DELAY.stop
  }
  if (PAUSES.includes(ch)) {
    return TYPE_DELAY.pause
  }
  return TYPE_DELAY.char
}

export default function useTypewriter (text: string, { key, paused = false, startDelay = 0 }: Options) {
  const [progress, setProgress] = useState({ key, shown: 0 })

  const shown = progress.key === key ? Math.min(progress.shown, text.length) : 0
  const done = shown >= text.length

  useEffect(() => {
    if (paused || shown >= text.length) {
      return
    }
    const delay = shown === 0
      ? startDelay + TYPE_DELAY.start
      : delayAfter(text[shown - 1])
    const timer = setTimeout(() => setProgress({ key, shown: shown + 1 }), delay / TEXT_SPEED)
    return () => clearTimeout(timer)
  }, [key, text, shown, paused, startDelay])

  const finish = () => setProgress({ key, shown: text.length })

  return { shown, done, finish }
}
