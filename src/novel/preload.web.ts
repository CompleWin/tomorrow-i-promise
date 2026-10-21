import { assetUrl } from '@/novel/config'

const blobs = new Map<string, string>()
const decoded: HTMLImageElement[] = []

async function preloadOne (url: string): Promise<void> {
  if (blobs.has(url)) {
    return
  }
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`asset ${url}: ${res.status}`)
  }
  const blobUrl = URL.createObjectURL(await res.blob())
  const img = new window.Image()
  img.src = blobUrl
  await img.decode()
  decoded.push(img)
  blobs.set(url, blobUrl)
}

export async function preloadAssets (paths: string[], version: string): Promise<void> {
  const results = await Promise.allSettled(paths.map(path => preloadOne(assetUrl(path, version))))
  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn('preload failed', result.reason)
    }
  }
}

export function assetSource (path: string, version: string | null): string {
  const url = assetUrl(path, version)
  return blobs.get(url) ?? url
}
