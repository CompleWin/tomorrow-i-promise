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
}

export default function useMenuSelection (actions: MenuAction[], { screen, enabled = true }: Options) {
  const [indexes, setIndexes] = useState<Record<string, number>>({})
  const count = actions.length
  const selected = count === 0 ? -1 : Math.min(indexes[screen] ?? 0, count - 1)
  const select = (next: number) => setIndexes(prev => ({ ...prev, [screen]: next }))

  useMenuKeys({
    enabled: enabled && count > 0,
    onMove: delta => setIndexes(prev => {
      const from = Math.min(prev[screen] ?? 0, count - 1)
      return { ...prev, [screen]: (from + delta + count) % count }
    }),
    onAdjust: delta => actions[selected]?.onAdjust?.(delta),
    onSelect: () => actions[selected]?.onPress(),
  })

  return { selected, select }
}
