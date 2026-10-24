import { Image } from 'expo-image'
import { assetUrl } from '@/novel/config'

const done = new Set<string>()

async function prefetch (paths: string[], version: string, cachePolicy: 'disk' | 'memory-disk') {
  await Promise.all(paths.map(async path => {
    const url = assetUrl(path, version)
    if (await Image.prefetch(url, { cachePolicy })) {
      done.add(url)
    }
  }))
}

export async function loadAssets (paths: string[], version: string): Promise<void> {
  await prefetch(paths, version, 'memory-disk')
}

export async function fetchSound (url: string): Promise<string> {
  return url
}

export async function loadMusic (paths: string[], version: string): Promise<void> {
  for (const path of paths) {
    done.add(assetUrl(path, version))
  }
}

export async function fetchAssets (paths: string[], version: string): Promise<void> {
  await prefetch(paths, version, 'disk')
}

export async function keepDecoded (paths: string[], version: string): Promise<void> {
  await prefetch(paths, version, 'memory-disk')
}

export function loadedShare (paths: string[], version: string): number {
  if (paths.length === 0) {
    return 1
  }
  return paths.filter(path => done.has(assetUrl(path, version))).length / paths.length
}

export function assetSource (path: string, version: string | null): string {
  return assetUrl(path, version)
}
