import type { Lang } from '@/novel/i18n'

type Seo = {
  title: string
  description: string
  ogLocale: string
  og: string
  genre: string
  heading: string
  noscript: string
}

export const SEO: Record<Lang, Seo> = {
  ru: {
    title: 'Завтра точно',
    description: 'Завтра точно — визуальная новелла о сложном выборе в пиксельном стиле. Играйте бесплатно прямо в браузере или на телефоне, без установки и регистрации.',
    ogLocale: 'ru_RU',
    og: 'og.png',
    genre: 'Визуальная новелла',
    heading: 'Завтра точно — визуальная новелла',
    noscript: 'Для игры включите JavaScript.',
  },
  en: {
    title: 'Tomorrow, I Promise',
    description: 'Tomorrow, I Promise is a pixel-art visual novel about a hard choice. Play free in your browser or on your phone, with no download and no sign-up.',
    ogLocale: 'en_US',
    og: 'og.en.png',
    genre: 'Visual novel',
    heading: 'Tomorrow, I Promise — a visual novel',
    noscript: 'Please enable JavaScript to play.',
  },
}
