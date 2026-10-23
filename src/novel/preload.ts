import { Image } from 'expo-image'
import { assetUrl } from '@/novel/config'

export async function loadAssets (paths: string[], version: string): Promise<void> {
  await Image.prefetch(paths.map(path => assetUrl(path, version)))
}

export async function fetchAssets (paths: string[], version: string): Promise<void> {
  await Image.prefetch(paths.map(path => assetUrl(path, version)), { cachePolicy: 'disk' })
}

export async function keepDecoded (paths: string[], version: string): Promise<void> {
  await Image.prefetch(paths.map(path => assetUrl(path, version)))
}

export function assetSource (path: string, version: string | null): string {
  return assetUrl(path, version)
}
