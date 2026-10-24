import type { ReactNode } from 'react'
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html'

const BASE = __DEV__ ? '' : process.env.EXPO_BASE_URL ?? ''
const TITLE = 'Завтра точно'
const DESCRIPTION = 'Визуальная новелла в пиксельном стиле, которая идёт в браузере и на телефоне.'
const SITE = `https://tomorrow-i-promise.ru${process.env.EXPO_BASE_URL ?? ''}/`
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
        <link rel="icon" href={`${BASE}/favicon.ico`} sizes="16x16 32x32 48x48" />
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  )
}
