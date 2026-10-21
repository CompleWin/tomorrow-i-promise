import AsyncStorage from '@react-native-async-storage/async-storage'
import { Story } from 'inkjs'
import { assetUrl, CONTENT_URL } from '@/novel/config'
import { preloadAssets } from '@/novel/preload'
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

const PRELOAD_TIMEOUT_MS = 15 * 1000
const ASSET_TAG = /"\^(?:bg|sprite):\s*([^"]+?)\s*"/g
const SFX_TAG = /"\^sfx:\s*([^"]+?)\s*"/g

export async function preloadStory (json: string, version: string): Promise<void> {
  const sounds = new Set<string>()
  for (const [, name] of json.matchAll(SFX_TAG)) {
    sounds.add(assetUrl(name, version))
  }
  preloadSounds([...sounds])

  const paths = new Set<string>()
  for (const [, value] of json.matchAll(ASSET_TAG)) {
    paths.add(value)
  }
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<void>(resolve => { timer = setTimeout(resolve, PRELOAD_TIMEOUT_MS) })
  try {
    await Promise.race([preloadAssets([...paths], version), timeout])
  } catch (error) {
    console.warn('preload failed', error)
  } finally {
    clearTimeout(timer)
  }
}
