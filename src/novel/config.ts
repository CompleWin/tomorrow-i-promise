import { Platform } from 'react-native'

const ENV_CONTENT_URL = process.env.EXPO_PUBLIC_CONTENT_URL ?? 'https://tomorrow-i-promise.ru/content'
const BASE = __DEV__ ? '' : process.env.EXPO_BASE_URL ?? ''

export const CONTENT_URL = Platform.OS === 'web' && typeof window !== 'undefined'
  ? `${window.location.origin}${BASE}/content`
  : ENV_CONTENT_URL

export function assetUrl(path: string, version: string | null): string {
  const url = `${CONTENT_URL}/assets/${path}`
  return version ? `${url}?v=${version}` : url
}
