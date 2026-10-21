import { AudioPlayer, createAudioPlayer, preload, setAudioModeAsync } from 'expo-audio'

let player: AudioPlayer | null = null
let modeSet = false

export function startSound () {
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
  try {
    player ??= createAudioPlayer(null)
    player.replace(url)
    player.seekTo(0).catch(error => console.warn('sfx seek failed', error))
    player.play()
  } catch (error) {
    console.warn('sfx failed', url, error)
  }
}

export function stopAll () {
  try {
    player?.pause()
  } catch (error) {
    console.warn('sfx stop failed', error)
  }
}

export function releaseSound () {
  try {
    player?.remove()
  } catch (error) {
    console.warn('sfx release failed', error)
  }
  player = null
}
