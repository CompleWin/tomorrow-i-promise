import { createAudioPlayer } from 'expo-audio'

export type LoopPlayer = {
  volume: number
  readonly playing: boolean
  play (): void
  pause (): void
  remove (): void
}

export function createLoop (url: string): LoopPlayer {
  const player = createAudioPlayer(url)
  player.loop = true
  return {
    get volume () {
      return player.volume
    },
    set volume (value: number) {
      player.volume = value
    },
    get playing () {
      return player.currentStatus.playing
    },
    play: () => player.play(),
    pause: () => player.pause(),
    remove: () => player.remove(),
  }
}
