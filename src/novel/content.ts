import AsyncStorage from '@react-native-async-storage/async-storage'
import { Story } from 'inkjs'
import { assetUrl, CONTENT_URL } from '@/novel/config'
import { fetchAssets, keepDecoded, loadAssets } from '@/novel/preload'
import { preloadSounds } from '@/novel/sound'

export type Manifest = {
  version: string
  story: string
}
type CachedStory = {
  version: string
  json: string
}
export type LoadedStory = CachedStory & { offline: boolean }

const STORY_KEY = 'tomorrow-i-promise.story'
const TIMEOUT_MS = 8 * 1000

async function readCache (): Promise<CachedStory | null> {
  try {
    const cache = await AsyncStorage.getItem(STORY_KEY)

    if (cache === null) {
      return null
    }

    const cacheData = JSON.parse(cache)
    if (typeof cacheData.version !== 'string' || typeof cacheData.json !== 'string') {
      return null
    }

    return cacheData as CachedStory
  } catch (error) {
    console.error('failed to read cache', error)
    return null
  }
}

export async function cachedVersion (): Promise<string | null> {
  const cached = await readCache()
  return cached?.version ?? null
}

async function writeCache(cache: CachedStory): Promise<void> {
  try {
    await AsyncStorage.setItem(STORY_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('failed to write cache', error)
  }
}

async function fetchWithTimeout (url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchManifest (): Promise<Manifest> {
  const res = await fetchWithTimeout(
    `${CONTENT_URL}/manifest.json?t=${Date.now()}`)

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const data = await res.json()
  if (typeof data.version !== 'string' || typeof data.story !== 'string') {
    throw new Error(`Missing version or story in manifest.json: ${data}`)
  }
  return data as Manifest
}

export async function getStory (): Promise<LoadedStory> {
  const cached = await readCache()

  let manifest: Manifest
  try {
    manifest = await fetchManifest()
  } catch (error) {
    console.warn('manifest failed', error)
    if (cached) {
      return { ...cached, offline: true }
    }
    throw new Error('Нет соединения, а сохраненной истории еще нет')
  }

  if (cached?.version === manifest.version) {
    return { ...cached, offline: false }
  }
  
  try {
    const res = await fetchWithTimeout(`${CONTENT_URL}/${manifest.story}?v=${manifest.version}`)

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`)
    }

    const json = await res.text()

    new Story(json)

    await writeCache({ version: manifest.version, json })

    return { version: manifest.version, json, offline: false}
  } catch (error) {
    if (cached) {
      return { ...cached, offline: true }
    }
    throw error
  }

}

const PRELOAD_TIMEOUT_MS = 2 * 60 * 1000
const ASSET_TAG = /"\^(bg|sprite|sfx):\s*([^"\s]+)[^"]*"/g
const ACT_PATH = /^act(\d+)\//

type ActAssets = {
  images: string[]
  sounds: string[]
}

let acts = new Map<number, ActAssets>()
let assetsVersion = ''
let enteredAct: number | null = null
let generation = 0
let readyActs = new Set<number>()
let loadingActs = new Map<number, Promise<void>>()

function collectAssets (json: string): Map<number, ActAssets> {
  const result = new Map<number, ActAssets>()
  for (const [, kind, path] of json.matchAll(ASSET_TAG)) {
    if (path === 'stop') {
      continue
    }
    const act = Number(ACT_PATH.exec(path)?.[1] ?? 0)
    let assets = result.get(act)
    if (assets === undefined) {
      assets = { images: [], sounds: [] }
      result.set(act, assets)
    }
    const list = kind === 'sfx' ? assets.sounds : assets.images
    if (!list.includes(path)) {
      list.push(path)
    }
  }
  return result
}

async function withTimeout (promise: Promise<void>): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<void>(resolve => { timer = setTimeout(resolve, PRELOAD_TIMEOUT_MS) })
  try {
    await Promise.race([promise, timeout])
  } catch (error) {
    console.warn('preload failed', error)
  } finally {
    clearTimeout(timer)
  }
}

function markReady (act: number, run: number) {
  if (run === generation) {
    readyActs.add(act)
  }
}

function preloadActSounds (act: number, version: string) {
  preloadSounds((acts.get(act)?.sounds ?? []).map(path => assetUrl(path, version)))
}

async function prefetchRest (act: number, version: string, run: number) {
  const order = [...acts.keys()].sort((a, b) => a - b)
  const rest = [...order.filter(n => n > act), ...order.filter(n => n < act)]
  for (const n of rest) {
    if (run !== generation) {
      return
    }
    await fetchAssets(acts.get(n)?.images ?? [], version)
    if (run !== generation) {
      return
    }
    markReady(n, run)
    preloadActSounds(n, version)
  }
}

export function actReady (act: number): boolean {
  return readyActs.has(act) || !acts.has(act)
}

export function loadAct (act: number): Promise<void> {
  let loading = loadingActs.get(act)
  if (loading === undefined) {
    const run = generation
    preloadActSounds(act, assetsVersion)
    loading = withTimeout(loadAssets(acts.get(act)?.images ?? [], assetsVersion))
      .then(() => markReady(act, run))
    loadingActs.set(act, loading)
  }
  return loading
}

export function enterAct (act: number) {
  if (act === enteredAct) {
    return
  }
  enteredAct = act
  const run = generation
  preloadActSounds(act + 1, assetsVersion)
  keepDecoded([
    ...acts.get(act)?.images ?? [],
    ...acts.get(act + 1)?.images ?? [],
  ], assetsVersion)
    .then(() => {
      markReady(act, run)
      markReady(act + 1, run)
    })
    .catch(error => console.warn('preload failed', error))
}

export async function preloadStory (json: string, version: string, act: number, currentBg: string | null): Promise<void> {
  generation += 1
  const run = generation
  acts = collectAssets(json)
  assetsVersion = version
  enteredAct = null
  readyActs = new Set()
  loadingActs = new Map()

  preloadActSounds(act, version)
  const images = acts.get(act)?.images ?? []
  const required = currentBg === null || images.includes(currentBg) ? images : [...images, currentBg]
  await withTimeout(loadAssets(required, version))
  markReady(act, run)

  prefetchRest(act, version, run).catch(error => console.warn('prefetch failed', error))
}
