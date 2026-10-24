import { createAudioPlayer } from 'expo-audio'

export type LoopPlayer = {
  volume: number
  readonly playing: boolean
  play (): void
  pause (): void
  remove (): void
}

export function streamLoop (url: string): LoopPlayer {
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

export type Crossfade = {
  at: number
  fade: number
  from: number
}

export function crossfadeLoop (url: string, { at, fade, from }: Crossfade): LoopPlayer {
  const players = [createAudioPlayer(url), createAudioPlayer(url)]
  for (const player of players) {
    player.loop = true
  }
  let current = 0
  let level = 1
  let mix = 1
  let fadeStart = 0
  let wanted = false

  function apply () {
    players[current].volume = level * Math.sin(mix * Math.PI / 2)
    players[1 - current].volume = level * Math.cos(mix * Math.PI / 2)
  }

  function tick () {
    if (!wanted) {
      return
    }
    try {
      if (mix < 1) {
        mix = Math.min(1, (Date.now() - fadeStart) / (fade * 1000))
        apply()
        if (mix === 1) {
          const old = players[1 - current]
          old.pause()
        }
        return
      }
      if (players[current].currentTime >= at) {
        current = 1 - current
        mix = 0
        fadeStart = Date.now()
        apply()
        const next = players[current]
        next.seekTo(from)
          .catch(error => console.warn('music seek failed', error))
          .then(() => {
            if (wanted && players[current] === next) {
              next.play()
            }
          })
      }
    } catch (error) {
      console.warn('music crossfade failed', url, error)
    }
  }

  const timer = setInterval(tick, 100)

  return {
    get volume () {
      return level
    },
    set volume (value: number) {
      level = value
      apply()
    },
    get playing () {
      return players[current].currentStatus.playing
    },
    play () {
      wanted = true
      players[current].play()
      if (mix < 1) {
        players[1 - current].play()
      }
    },
    pause () {
      wanted = false
      for (const player of players) {
        player.pause()
      }
    },
    remove () {
      clearInterval(timer)
      for (const player of players) {
        player.remove()
      }
    },
  }
}
