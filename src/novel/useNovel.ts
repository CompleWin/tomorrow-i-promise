import { Story } from 'inkjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clearSave, loadSave, writeSave } from '@/novel/storage'
import { getStory } from '@/novel/content'

type Line = {
  text: string
  speaker: string | null
  bg: string | null
  sprite: string | null
  choices: { index: number; text: string }[]
  ended: boolean
}

const EMPTY: Line = {
  text: '',
  speaker: null,
  bg: null,
  sprite: null,
  choices: [],
  ended: false,
}

function parseTags (tags: string[] | null): Record<string, string> {
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

export default function useNovel () {
  const storyRef = useRef<Story | null>(null)
  const bgRef = useRef<string | null>(null)
  const versionRef = useRef<string | null>(null)

  const [line, setLine] = useState<Line>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)

  const show = useCallback((story: Story) => {
    const text = (story.currentText ?? '').trim()
    const tags = parseTags(story.currentTags)
    const choices = story.currentChoices.map(
      c => ({ index: c.index, text: c.text }))

    bgRef.current = tags.bg ?? bgRef.current

    setLine({
      text: text,
      speaker: tags.speaker ?? null,
      bg: bgRef.current,
      sprite: tags.sprite ?? null,
      choices: choices,
      ended: !story.canContinue && choices.length === 0,
    })

    const fc = story.variablesState['final_choice']
    const finalChoice = fc === 'A' || fc === 'B' ? fc : null
    const voteStatus = finalChoice !== null ? 'pending' : 'none'

    writeSave({
      schema: 1,
      inkState: story.state.ToJson(),
      contentVersion: versionRef.current,
      currentBg: bgRef.current,
      finalChoice: finalChoice,
      voteStatus: voteStatus,
    })
  }, [])

  const step = useCallback(() => {
    const story = storyRef.current
    if (!story) {
      return
    }

    if (story.canContinue) {
      story.Continue()
    }

    show(story)
  }, [show])

  useEffect(() => {
    let cancelled = false

    async function load () {
      try {
        const loaded = await getStory()
        if (cancelled) {
          return
        }

        versionRef.current = loaded.version
        setVersion(loaded.version)
        storyRef.current = new Story(loaded.json)

        const save = await loadSave()
        if (cancelled) {
          return
        }

        if (save) {
          try {
            storyRef.current.state.LoadJson(save.inkState)
            bgRef.current = save.currentBg
            show(storyRef.current)
            return
          } catch (error) {
            console.warn('save does not fit the story', error)
            await clearSave()
            storyRef.current = new Story(loaded.json)

            if (save.contentVersion !== loaded.version) {
              setNotice('История обновилась, начинаем сначала')
            } else {
              setNotice('Сохранение повреждено, начинаем сначала')
            }
          }
        }

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
  }, [step, show])

  const next = useCallback(() => {
    setNotice(null)

    if (line.choices.length > 0) {
      return
    }
    step()
  }, [line.choices.length, step])

  const choose = useCallback((index: number) => {
    storyRef.current?.ChooseChoiceIndex(index)
    step()
  }, [step])

  return { ...line, loading, error, notice, version, next, choose }

}


