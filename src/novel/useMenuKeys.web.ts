import { useEffect, useEffectEvent } from 'react'

type Keys = {
  enabled: boolean
  onMove: (delta: number) => void
  onAdjust: (delta: number) => void
  onSelect: () => void
}

export default function useMenuKeys ({ enabled, onMove, onAdjust, onSelect }: Keys) {
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return
    }
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      onMove(event.key === 'ArrowUp' ? -1 : 1)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      onAdjust(event.key === 'ArrowLeft' ? -1 : 1)
      return
    }
    if (event.key !== ' ' && event.key !== 'Enter') {
      return
    }
    event.preventDefault()
    if (event.repeat) {
      return
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    onSelect()
  })

  useEffect(() => {
    if (!enabled) {
      return
    }
    const listener = (event: KeyboardEvent) => onKey(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [enabled])
}
