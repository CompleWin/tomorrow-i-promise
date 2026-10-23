import { useState } from 'react'
import useMenuKeys from '@/novel/useMenuKeys'

export type MenuAction = {
  label: string
  onPress: () => void
  onAdjust?: (delta: number) => void
}

type Options = {
  screen: string
  enabled?: boolean
  horizontal?: boolean
  initial?: number
}

export default function useMenuSelection (actions: MenuAction[], { screen, enabled = true, horizontal = false, initial = 0 }: Options) {
  const [indexes, setIndexes] = useState<Record<string, number>>({})
  const count = actions.length
  const index = indexes[screen] ?? initial
  const selected = count === 0 || index < 0 ? -1 : Math.min(index, count - 1)
  const select = (next: number) => setIndexes(prev => ({ ...prev, [screen]: next }))

  const move = (delta: number) => setIndexes(prev => {
    const from = Math.min(prev[screen] ?? initial, count - 1)
    if (from < 0) {
      return { ...prev, [screen]: delta > 0 ? 0 : count - 1 }
    }
    return { ...prev, [screen]: (from + delta + count) % count }
  })

  useMenuKeys({
    enabled: enabled && count > 0,
    onMove: move,
    onAdjust: delta => {
      const adjust = actions[selected]?.onAdjust
      if (adjust) {
        adjust(delta)
      } else if (horizontal) {
        move(delta)
      }
    },
    onSelect: () => actions[selected]?.onPress(),
  })

  return { selected, select }
}
