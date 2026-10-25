import type { ReactNode } from 'react'
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html'
import { AUTHORS, REPO_URL } from '@/novel/credits'

const BASE = __DEV__ ? '' : process.env.EXPO_BASE_URL ?? ''
const TITLE = 'Завтра точно'
const DESCRIPTION = 'Завтра точно — визуальная новелла о сложном выборе в пиксельном стиле. Играйте бесплатно прямо в браузере или на телефоне, без установки и регистрации.'
const CF_TOKEN = __DEV__ ? undefined : process.env.EXPO_PUBLIC_CF_ANALYTICS_TOKEN
const SITE = `https://tomorrow-i-promise.ru${process.env.EXPO_BASE_URL ?? ''}/`
const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: TITLE,
  alternateName: 'Tomorrow, I Promise',
  description: DESCRIPTION,
  url: SITE,
  image: `${SITE}og.png`,
  inLanguage: 'ru',
  genre: ['Визуальная новелла', 'Visual novel'],
  gamePlatform: 'Web browser',
  applicationCategory: 'Game',
  operatingSystem: 'Any',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'RUB' },
  author: AUTHORS.map(({ name }) => ({ '@type': 'Person', name })),
  sameAs: [REPO_URL],
}).replace(/</g, '\\u003c')
const CSS = [
  'body{background-color:#000}',
  '*{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}',
  'img{-webkit-user-drag:none}',
].join('')

export default function Root ({ children }: { children: ReactNode }) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext()

  return (
    <html lang="ru" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={TITLE} />
        <meta name="theme-color" content="#050403" />
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={TITLE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:image" content={`${SITE}og.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE}og.png`} />
        <meta name="author" content={AUTHORS.map(({ name }) => name).join(', ')} />
        <meta name="yandex-verification" content="3607e2ca274e5637" />
        <link rel="icon" href={`${BASE}/favicon.ico`} sizes="16x16 32x32 48x48" />
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        {CF_TOKEN && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_TOKEN })} />
        )}
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        <noscript>
          <h1>{TITLE} — визуальная новелла</h1>
          <p>{DESCRIPTION}</p>
          <p>Для игры включите JavaScript.</p>
        </noscript>
        {children}
        {bodyNodes}
      </body>
    </html>
  )
}
