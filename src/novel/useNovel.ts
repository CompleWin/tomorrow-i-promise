import { Story } from 'inkjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { clearSave, loadSave, VoteStatus, writeSave } from '@/novel/storage'
import { fetchManifest, getStory, preloadStory } from '@/novel/content'
import { AppState } from 'react-native'
import { Choice, submitVote } from '@/novel/vote'

export type Line = {
  lineId: number
  text: string
  speaker: string | null
  bg: string | null
  sprite: string | null
  fx: string | null
  sfx: string | null
  music: string | null
  loops: string[]
  dark: boolean
  resumed: boolean
  choices: { index: number; text: string }[]
  ended: boolean
}

const EMPTY: Line = {
  lineId: 0,
  text: '',
  speaker: null,
  bg: null,
  sprite: null,
  fx: null,
  sfx: null,
  music: null,
  loops: [],
  dark: false,
  resumed: false,
  choices: [],
  ended: false,
}

type Vote = {
  finalChoice: Choice | null
  voteStatus: VoteStatus
}

const NO_VOTE: Vote = {
  finalChoice: null,
  voteStatus: 'none',
}

const ACT = /^act_(\d+)/

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

function tagValues (tags: string[] | null, key: string): string[] {
  return (tags ?? []).flatMap(tag => {
    const colon = tag.indexOf(':')
    if (colon === -1 || tag.slice(0, colon).trim() !== key) {
      return []
    }
    return [tag.slice(colon + 1).trim()]
  })
}

export default function useNovel (startAct?: string) {
  const storyRef = useRef<Story | null>(null)
  const bgRef = useRef<string | null>(null)
  const darkRef = useRef(false)
  const actRef = useRef<number | null>(null)
  const musicRef = useRef<string | null>(null)
  const loopsRef = useRef<string[]>([])
  const versionRef = useRef<string | null>(null)
  const lineIdRef = useRef(0)

  const [line, setLine] = useState<Line>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)

  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const voteRef = useRef<Vote>(NO_VOTE)
  const [vote, setVote] = useState<Vote>(NO_VOTE)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async state => {
      if (state !== 'active') {
        return
      }
      try {
        const manifest = await fetchManifest()
        if (versionRef.current !== null && versionRef.current !==
          manifest.version) {
          setUpdateAvailable(true)
        }
      } catch (error) {
        console.warn('update check failed', error)
      }
    })

    return () => subscription.remove()
  }, [])

  const persist = useCallback((story: Story) => {
    writeSave({
      schema: 2,
      inkState: story.state.ToJson(),
      contentVersion: versionRef.current,
      currentBg: bgRef.current,
      finalChoice: voteRef.current.finalChoice,
      voteStatus: voteRef.current.voteStatus,
      dark: darkRef.current,
      act: actRef.current,
      music: musicRef.current,
      loops: loopsRef.current,
    })
  }, [])

  const show = useCallback((story: Story, resumed = false): Line => {
    const text = (story.currentText ?? '').trim()
    const tags = parseTags(story.currentTags)
    const choices = story.currentChoices.map(
      c => ({ index: c.index, text: c.text }))

    bgRef.current = tags.bg ?? bgRef.current
    if (tags.bg !== undefined) {
      darkRef.current = false
    }
    if (tags.fx === 'toBlack') {
      darkRef.current = true
    }
    if (tags.music !== undefined) {
      musicRef.current = tags.music === 'stop' ? null : tags.music
    }
    let sfx: string | null = null
    for (const value of tagValues(story.currentTags, 'sfx')) {
      const [path, mode] = value.split(/\s+/)
      if (path === 'stop') {
        loopsRef.current = []
      } else if (mode === 'loop') {
        if (!loopsRef.current.includes(path)) {
          loopsRef.current = [...loopsRef.current, path]
        }
      } else {
        sfx = path
      }
    }
    const act = ACT.exec(story.state.currentPathString ?? '')
    if (act !== null) {
      actRef.current = Number(act[1])
    }
    lineIdRef.current += 1

    const shown: Line = {
      lineId: lineIdRef.current,
      text: text,
      speaker: tags.speaker ?? null,
      bg: bgRef.current,
      sprite: tags.sprite ?? null,
      fx: tags.fx ?? null,
      sfx: sfx,
      music: musicRef.current,
      loops: loopsRef.current,
      dark: darkRef.current,
      resumed: resumed,
      choices: choices,
      ended: !story.canContinue && choices.length === 0,
    }
    setLine(shown)

    const fc = story.variablesState['final_choice']
    if ((fc === 'A' || fc === 'B') && voteRef.current.voteStatus === 'none') {
      voteRef.current = { finalChoice: fc, voteStatus: 'pending' }
    }
    setVote(voteRef.current)
    persist(story)
    return shown
  }, [persist])

  const step = useCallback((): Line | null => {
    const story = storyRef.current
    if (!story) {
      return null
    }

    if (story.canContinue) {
      story.Continue()
    }

    return show(story)
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
        await preloadStory(loaded.json, loaded.version)
        if (cancelled) {
          return
        }

        voteRef.current = NO_VOTE
        bgRef.current = null
        darkRef.current = false
        actRef.current = null
        musicRef.current = null
        loopsRef.current = []

        const save = startAct ? null : await loadSave()
        if (cancelled) {
          return
        }

        if (save) {
          try {
            storyRef.current.state.LoadJson(save.inkState)
            bgRef.current = save.currentBg
            darkRef.current = save.dark
            actRef.current = save.act
            musicRef.current = save.music
            loopsRef.current = save.loops
            voteRef.current = {
              finalChoice: save.finalChoice,
              voteStatus: save.voteStatus,
            }
            show(storyRef.current, true)
            return
          } catch (error) {
            console.warn('save does not fit the story', error)
            await clearSave()
            storyRef.current = new Story(loaded.json)
            bgRef.current = null
            darkRef.current = false
            actRef.current = null
            musicRef.current = null
            loopsRef.current = []

            if (save.contentVersion !== loaded.version) {
              setNotice('История обновилась, начинаем сначала')
            } else {
              setNotice('Сохранение повреждено, начинаем сначала')
            }
          }
        }

        if (startAct) {
          storyRef.current.ChoosePathString(`act_${startAct}`)
        }
        step()
      } catch (error) {
        console.warn('story load failed', error)
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
  }, [step, show, reloadKey, startAct])

  useEffect(() => {
    const { finalChoice, voteStatus } = vote
    const version = versionRef.current
    if (voteStatus !== 'pending' || finalChoice === null || version === null) {
      return
    }

    let cancelled = false
    submitVote(finalChoice, version).then(() => {
      if (cancelled) {
        return
      }
      voteRef.current = { finalChoice: finalChoice, voteStatus: 'sent' }
      setVote(voteRef.current)
      if (storyRef.current !== null) {
        persist(storyRef.current)
      }
    }).catch(error => console.warn('vote failed', error))

    return () => {cancelled = true}
  }, [vote, persist])

  const next = useCallback((): Line | null => {
    setNotice(null)

    if (line.choices.length > 0) {
      return null
    }
    return step()
  }, [line.choices.length, step])

  const choose = useCallback((index: number) => {
    storyRef.current?.ChooseChoiceIndex(index)
    step()
  }, [step])

  const reload = useCallback(() => {
    setUpdateAvailable(false)
    setError(null)
    setLoading(true)
    setReloadKey(k => k + 1)
  }, [])

  return {
    ...line,
    loading,
    error,
    notice,
    version,
    updateAvailable,
    finalChoice: vote.finalChoice,
    voteStatus: vote.voteStatus,
    next,
    choose,
    reload,
  }

}


