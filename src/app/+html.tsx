import type { ReactNode } from 'react'
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html'

const BASE = __DEV__ ? '' : process.env.EXPO_BASE_URL ?? ''
const TITLE = 'Завтра точно'

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
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/icon.png`} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#000}' }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  )
}
