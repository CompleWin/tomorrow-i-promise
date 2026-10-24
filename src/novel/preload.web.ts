import { assetUrl } from '@/novel/config'

const FETCH_CONCURRENCY = 3

const pending = new Map<string, Promise<string>>()
const blobs = new Map<string, string>()
const received = new Map<string, { loaded: number, total: number }>()
const decoded = new Map<string, HTMLImageElement>()
let wanted = new Set<string>()

async function readBody (url: string, res: Response): Promise<Blob> {
  const total = Number(res.headers.get('Content-Length'))
  if (res.body === null || !(total > 0)) {
    return res.blob()
  }
  const progress = { loaded: 0, total }
  received.set(url, progress)
  const reader = res.body.getReader()
  const chunks: BlobPart[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
    progress.loaded += value.length
  }
  return new Blob(chunks, { type: res.headers.get('Content-Type') ?? '' })
}

export function loadedShare (paths: string[], version: string): number {
  if (paths.length === 0) {
    return 1
  }
  const urls = paths.map(path => assetUrl(path, version))
  const sizes = urls.flatMap(url => received.get(url)?.total ?? [])
  const average = sizes.length > 0 ? sizes.reduce((sum, size) => sum + size, 0) / sizes.length : 1
  let loaded = 0
  let total = 0
  for (const url of urls) {
    const progress = received.get(url)
    const size = progress?.total ?? average
    total += size
    if (blobs.has(url)) {
      loaded += size
    } else if (progress !== undefined) {
      loaded += Math.min(progress.loaded, size)
    }
  }
  return loaded / total
}

export function fetchSound (url: string): Promise<string> {
  return fetchOne(url)
}

function fetchOne (url: string): Promise<string> {
  let blob = pending.get(url)
  if (blob === undefined) {
    blob = fetch(url).then(async res => {
      if (!res.ok) {
        throw new Error(`asset ${url}: ${res.status}`)
      }
      const blobUrl = URL.createObjectURL(await readBody(url, res))
      blobs.set(url, blobUrl)
      return blobUrl
    })
    blob.catch(() => pending.delete(url))
    pending.set(url, blob)
  }
  return blob
}

async function decodeOne (url: string): Promise<void> {
  if (decoded.has(url)) {
    return
  }
  const img = new window.Image()
  img.src = await fetchOne(url)
  await img.decode()
  if (wanted.has(url)) {
    decoded.set(url, img)
  }
}

function report (results: PromiseSettledResult<void>[]) {
  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn('preload failed', result.reason)
    }
  }
}

export async function loadAssets (paths: string[], version: string): Promise<void> {
  const urls = paths.map(path => assetUrl(path, version))
  for (const url of urls) {
    wanted.add(url)
  }
  report(await Promise.allSettled(urls.map(decodeOne)))
}

export async function loadMusic (paths: string[], version: string): Promise<void> {
  report(await Promise.allSettled(paths.map(async path => {
    await fetchOne(assetUrl(path, version))
  })))
}

export async function fetchAssets (paths: string[], version: string): Promise<void> {
  const urls = paths.map(path => assetUrl(path, version))
  let next = 0
  async function worker () {
    while (next < urls.length) {
      const url = urls[next]
      next += 1
      try {
        await fetchOne(url)
      } catch (error) {
        console.warn('prefetch failed', error)
      }
    }
  }
  await Promise.all(Array.from({ length: FETCH_CONCURRENCY }, worker))
}

export async function keepDecoded (paths: string[], version: string): Promise<void> {
  wanted = new Set(paths.map(path => assetUrl(path, version)))
  for (const url of decoded.keys()) {
    if (!wanted.has(url)) {
      decoded.delete(url)
    }
  }
  report(await Promise.allSettled([...wanted].map(decodeOne)))
}

export function assetSource (path: string, version: string | null): string {
  const url = assetUrl(path, version)
  return blobs.get(url) ?? url
}
