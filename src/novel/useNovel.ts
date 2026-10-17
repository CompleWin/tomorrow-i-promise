import { Story } from 'inkjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTENT_URL } from '@/novel/config'

type Line = {
  text: string
  speaker: string | null
  bg: string | null
  choices: { index: number; text: string }[]
  ended: boolean
}

const EMPTY: Line = {
  text: '',
  speaker: null,
  bg: null,
  choices: [],
  ended: false,
}

function parseTags(tags: string[] | null): Record<string, string> {
  const result: Record<string, string> = {}
  for (const tag of tags ?? []) {
    const colon = tag.indexOf(':')
    if (colon === -1) {
      continue
    }
    const key = tag.slice(0, colon).trim()
    const value = tag.slice(colon + 1).trim()
    result[key] = value
  }
  return result
}

export function useNovel() {
  const storyRef = useRef<Story | null>(null)
  const [line, setLine] = useState<Line>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const step = useCallback(() => {
    const story = storyRef.current
    if (!story) {
      return
    }

    let text = ''
    let tags: Record<string, string> = {}
    if (story.canContinue) {
      text = (story.Continue() ?? '').trim()
      tags = parseTags(story.currentTags)
    }

    const choices = story.currentChoices.map(c => ({ index: c.index, text: c.text}))

    setLine(prev => ({
      text,
      speaker: tags.speaker ?? null,
      bg: tags.bg ?? prev.bg,
      choices,
      ended: !story.canContinue && choices.length === 0
    }))
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetch(`${CONTENT_URL}/story.json`)
        if (!result.ok) {
          throw new Error(`HTTP ${result.status}`)
        }
        const json = await result.text()

        if (cancelled) {
          return
        }
        storyRef.current = new Story(json)
        step()
      } catch (error) {
        if (!cancelled) {
          setError(String(error))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [step])

  const next = useCallback(() => {
    if (line.choices.length > 0) {
      return
    }
    step()
  }, [line.choices.length, step])

  const choose = useCallback((index: number) => {
    storyRef.current?.ChooseChoiceIndex(index)
    step()
  }, [step])

  return { ...line, loading, error, next, choose }

}


