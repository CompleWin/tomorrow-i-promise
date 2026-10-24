import { fetchSound } from '@/novel/preload'
import type { LoopPlayer } from '@/novel/streamLoop'

let context: AudioContext | null = null

function audioContext () {
  context ??= new AudioContext()
  return context
}

export function createLoop (url: string): LoopPlayer {
  const ctx = audioContext()
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  let buffer: AudioBuffer | null = null
  let source: AudioBufferSourceNode | null = null
  let wanted = false
  let removed = false

  function start () {
    if (!wanted || removed || buffer === null || source !== null) {
      return
    }
    source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(gain)
    source.start()
  }

  function stop () {
    source?.stop()
    source?.disconnect()
    source = null
  }

  fetchSound(url)
    .then(blobUrl => fetch(blobUrl))
    .then(res => res.arrayBuffer())
    .then(data => ctx.decodeAudioData(data))
    .then(decoded => {
      buffer = decoded
      start()
    })
    .catch(error => console.warn('sfx loop failed', url, error))

  return {
    get volume () {
      return gain.gain.value
    },
    set volume (value: number) {
      gain.gain.value = value
    },
    get playing () {
      return wanted && ctx.state === 'running'
    },
    get ready () {
      return buffer !== null
    },
    play () {
      wanted = true
      ctx.resume().catch(error => console.warn('audio resume failed', error))
      start()
    },
    pause () {
      wanted = false
      stop()
    },
    remove () {
      removed = true
      wanted = false
      stop()
      gain.disconnect()
    },
  }
}
