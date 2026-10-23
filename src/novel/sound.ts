import { Platform } from 'react-native'
import { AudioPlayer, createAudioPlayer, preload, setAudioModeAsync } from 'expo-audio'
import { createLoop } from '@/novel/loopPlayer'
import { Crossfade, crossfadeLoop, LoopPlayer } from '@/novel/streamLoop'
import { DEFAULT_SETTINGS, loadSettings, Settings } from '@/novel/storage'

const FADE_MS = 500
const FADE_STEPS = 10
const RISE_MS = 3000
const RISE_STEPS = 30

type Loop = {
  url: string
  player: AudioPlayer
}

let player: AudioPlayer | null = null
let music: LoopPlayer | null = null
let track: string | null = null
let loops: Loop[] = []
let rise = 1
let riseTimer: ReturnType<typeof setInterval> | null = null
let modeSet = false
let levels: Settings = DEFAULT_SETTINGS

function sfxLevel () {
  return levels.volume * levels.sfx / 10000
}

function musicLevel () {
  return levels.volume * levels.music / 10000
}

function fadeOut (fading: Pick<LoopPlayer, 'volume' | 'pause' | 'remove'>) {
  let from = 0
  try {
    from = fading.volume
  } catch (error) {
    console.warn('music fade failed', error)
  }
  let step = 0
  const timer = setInterval(() => {
    step += 1
    try {
      if (step < FADE_STEPS) {
        fading.volume = from * (1 - step / FADE_STEPS)
        return
      }
      fading.pause()
      fading.remove()
    } catch (error) {
      console.warn('music fade failed', error)
    }
    clearInterval(timer)
  }, FADE_MS / FADE_STEPS)
}

function stopRise () {
  if (riseTimer !== null) {
    clearInterval(riseTimer)
    riseTimer = null
  }
  rise = 1
}

function fadeIn () {
  stopRise()
  rise = 0
  let step = 0
  riseTimer = setInterval(() => {
    step += 1
    rise = (step / RISE_STEPS) ** 2
    try {
      if (music !== null && musicLevel() > 0) {
        music.volume = musicLevel() * rise
      }
    } catch (error) {
      console.warn('music fade failed', error)
    }
    if (step >= RISE_STEPS) {
      stopRise()
    }
  }, RISE_MS / RISE_STEPS)
}

function resumeMusic () {
  if (music === null || musicLevel() === 0) {
    return
  }
  try {
    music.volume = musicLevel() * rise
    if (!music.playing) {
      music.play()
    }
  } catch (error) {
    console.warn('music failed', track, error)
  }
}

function resumeLoops () {
  if (sfxLevel() === 0) {
    return
  }
  for (const loop of loops) {
    try {
      loop.player.volume = sfxLevel()
      if (!loop.player.currentStatus.playing) {
        loop.player.play()
      }
    } catch (error) {
      console.warn('sfx failed', loop.url, error)
    }
  }
}

export function setLevels (next: Settings) {
  levels = next
  try {
    if (sfxLevel() === 0) {
      player?.pause()
      for (const loop of loops) {
        loop.player.pause()
      }
    } else if (player !== null) {
      player.volume = sfxLevel()
    }
    if (musicLevel() === 0) {
      music?.pause()
    }
  } catch (error) {
    console.warn('volume failed', error)
  }
  resumeMusic()
  resumeLoops()
}

export function startSound () {
  loadSettings().then(setLevels)
  if (modeSet) {
    return
  }
  modeSet = true
  if (Platform.OS === 'web') {
    for (const event of ['pointerdown', 'keydown']) {
      window.addEventListener(event, () => {
        resumeMusic()
        resumeLoops()
      })
    }
  }
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' })
    .catch(error => console.warn('audio mode failed', error))
}

export function preloadSounds (urls: string[]) {
  for (const url of urls) {
    Promise.resolve()
      .then(() => preload(url))
      .catch(error => console.warn('sfx preload failed', url, error))
  }
}

export function playSfx (url: string) {
  if (sfxLevel() === 0) {
    return
  }
  try {
    player ??= createAudioPlayer(null)
    player.replace(url)
    player.volume = sfxLevel()
    player.seekTo(0).catch(error => console.warn('sfx seek failed', error))
    player.play()
  } catch (error) {
    console.warn('sfx failed', url, error)
  }
}

export function playLoops (urls: string[]) {
  const next: Loop[] = []
  for (const url of urls) {
    const kept = loops.find(loop => loop.url === url)
    if (kept !== undefined) {
      next.push(kept)
      continue
    }
    try {
      const created = createAudioPlayer(url)
      created.loop = true
      next.push({ url, player: created })
    } catch (error) {
      console.warn('sfx failed', url, error)
    }
  }
  for (const loop of loops) {
    if (!next.includes(loop)) {
      fadeOut(loop.player)
    }
  }
  loops = next
  resumeLoops()
}

export function playMusic (url: string | null, crossfade?: Crossfade) {
  if (url === track) {
    resumeMusic()
    return
  }
  if (music !== null) {
    fadeOut(music)
  }
  music = null
  track = url
  stopRise()
  if (url === null) {
    return
  }
  try {
    music = crossfade === undefined ? createLoop(url) : crossfadeLoop(url, crossfade)
  } catch (error) {
    console.warn('music failed', url, error)
    return
  }
  fadeIn()
  resumeMusic()
}

export function stopSfx () {
  try {
    player?.pause()
  } catch (error) {
    console.warn('sfx stop failed', error)
  }
}

export function stopAll () {
  stopSfx()
  playLoops([])
  playMusic(null)
}

export function releaseSound () {
  for (const released of [player, music, ...loops.map(loop => loop.player)]) {
    try {
      released?.remove()
    } catch (error) {
      console.warn('sound release failed', error)
    }
  }
  stopRise()
  player = null
  music = null
  track = null
  loops = []
}
