import { AudioPlayer, createAudioPlayer, preload, setAudioModeAsync } from 'expo-audio'
import { DEFAULT_SETTINGS, loadSettings, Settings } from '@/novel/storage'

const FADE_MS = 500
const FADE_STEPS = 10

let player: AudioPlayer | null = null
let music: AudioPlayer | null = null
let track: string | null = null
let modeSet = false
let levels: Settings = DEFAULT_SETTINGS

function sfxLevel () {
  return levels.volume * levels.sfx / 10000
}

function musicLevel () {
  return levels.volume * levels.music / 10000
}

function fadeOut (fading: AudioPlayer) {
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

function resumeMusic () {
  if (music === null || musicLevel() === 0) {
    return
  }
  try {
    music.volume = musicLevel()
    if (!music.currentStatus.playing) {
      music.play()
    }
  } catch (error) {
    console.warn('music failed', track, error)
  }
}

export function setLevels (next: Settings) {
  levels = next
  try {
    if (sfxLevel() === 0) {
      player?.pause()
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
}

export function startSound () {
  loadSettings().then(setLevels)
  if (modeSet) {
    return
  }
  modeSet = true
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

export function playMusic (url: string | null) {
  if (url === track) {
    resumeMusic()
    return
  }
  if (music !== null) {
    fadeOut(music)
  }
  music = null
  track = url
  if (url === null) {
    return
  }
  try {
    music = createAudioPlayer(url)
    music.loop = true
  } catch (error) {
    console.warn('music failed', url, error)
    return
  }
  resumeMusic()
}

export function stopAll () {
  try {
    player?.pause()
  } catch (error) {
    console.warn('sfx stop failed', error)
  }
  playMusic(null)
}

export function releaseSound () {
  for (const released of [player, music]) {
    try {
      released?.remove()
    } catch (error) {
      console.warn('sound release failed', error)
    }
  }
  player = null
  music = null
  track = null
}
