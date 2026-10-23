type Keys = {
  enabled: boolean
  onMove: (delta: number) => void
  onAdjust: (delta: number) => void
  onSelect: () => void
}

export default function useMenuKeys (_keys: Keys) {}
