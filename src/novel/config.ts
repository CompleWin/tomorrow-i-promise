export const CONTENT_URL = process.env.EXPO_PUBLIC_CONTENT_URL ?? 'https://complewin.github.io/tomorrow-i-promise/content'

export function assetUrl(path: string, version: string | null): string {
  const url = `${CONTENT_URL}/assets/${path}`
  return version ? `${url}?v=${version}` : url
}