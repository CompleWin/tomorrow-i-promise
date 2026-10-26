import type { ReactNode } from 'react'
import {
  ScrollViewStyleReset,
  useServerDocumentContext,
} from 'expo-router/html'
import { LANGUAGES, SOURCE_LANG } from '@/novel/i18n'
import { SEO } from '@/novel/i18n/seo'

const BASE = __DEV__ ? '' : process.env.EXPO_BASE_URL ?? ''
const CSS = [
  'body{background-color:#000}',
  '*{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}',
  'img{-webkit-user-drag:none}',
].join('')

export default function Root ({ children }: { children: ReactNode }) {
  const {
    bodyAttributes,
    bodyNodes,
    htmlAttributes,
    headNodes,
  } = useServerDocumentContext()

  return (
    <html dir="ltr" {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style"
            content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SEO[SOURCE_LANG].title} />
      <meta name="theme-color" content="#050403" />
      <meta name="yandex-verification" content="3607e2ca274e5637" />
      <link rel="icon" href={`${BASE}/favicon.ico`} sizes="16x16 32x32 48x48" />
      <link rel="manifest" href={`${BASE}/manifest.json`} />
      <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
      <ScrollViewStyleReset />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <script type="module"
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "9e1e960aaca044a9b69db846984fe8c5"}'></script>
      {headNodes}
    </head>
    <body {...bodyAttributes}>
    <noscript>
      {LANGUAGES.map(({ code }) => (
        <div key={code} lang={code}>
          <h1>{SEO[code].heading}</h1>
          <p>{SEO[code].description}</p>
          <p>{SEO[code].noscript}</p>
        </div>
      ))}
    </noscript>
    {children}
    {bodyNodes}
    </body>
    </html>
  )
}
