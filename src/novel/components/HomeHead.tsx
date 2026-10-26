import Head from 'expo-router/head'
import { AUTHORS, REPO_URL } from '@/novel/credits'
import { Lang, langPath, LANGUAGES, SOURCE_LANG, STRINGS } from '@/novel/i18n'
import { SEO } from '@/novel/i18n/seo'

const SITE = `https://tomorrow-i-promise.ru${process.env.EXPO_BASE_URL ?? ''}`

function pageUrl (lang: Lang): string {
  const path = langPath(lang)
  return `${SITE}${path === '/' ? '/' : `${path}/`}`
}

export default function HomeHead ({ lang }: { lang: Lang }) {
  const seo = SEO[lang]
  const url = pageUrl(lang)
  const image = `${SITE}/${seo.og}`
  const authors = AUTHORS.map(({ handle }) => STRINGS[lang].credits.authors[handle])
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: seo.title,
    alternateName: LANGUAGES.filter(language => language.code !== lang).map(language => SEO[language.code].title),
    description: seo.description,
    url,
    image,
    inLanguage: lang,
    genre: seo.genre,
    gamePlatform: 'Web browser',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'RUB' },
    author: authors.map(name => ({ '@type': 'Person', name })),
    sameAs: [REPO_URL],
  }).replace(/</g, '\\u003c')

  return (
    <Head>
      <meta name="description" content={seo.description} />
      <meta name="author" content={authors.join(', ')} />
      <link rel="canonical" href={url} />
      {LANGUAGES.map(language => (
        <link key={language.code} rel="alternate" hrefLang={language.code} href={pageUrl(language.code)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={pageUrl(SOURCE_LANG)} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seo.title} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={seo.ogLocale} />
      {LANGUAGES.filter(language => language.code !== lang).map(language => (
        <meta key={language.code} property="og:locale:alternate" content={SEO[language.code].ogLocale} />
      ))}
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seo.title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{jsonLd}</script>
    </Head>
  )
}
