import table from '@/novel/menuArt.json'
import type { Crossfade } from '@/novel/streamLoop'

export type MenuArt = {
  base: string
  flicker?: string
}

export const MENU_ART: Record<number, MenuArt> = table.acts

export const MENU_ART_COMPLETED: MenuArt = table.completed

export const MENU_MUSIC: Crossfade & { file: string } = table.music

export function menuArtFor (act: number | null): MenuArt {
  return (act !== null ? MENU_ART[act] : undefined) ?? MENU_ART[1]
}
