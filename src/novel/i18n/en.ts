import type { Strings } from '@/novel/i18n/ru'

const plural = new Intl.PluralRules('en')

const en: Strings = {
  title: ['Tomorrow,', 'I Promise'],
  menu: {
    continue: 'Continue',
    restart: 'Start over',
    start: 'Start',
    stats: 'Statistics',
    settings: 'Settings',
    credits: 'Credits',
    back: 'Back',
  },
  pause: {
    title: 'Pause',
    settings: 'Settings',
    resume: 'Continue',
    menu: 'Main menu',
    back: 'Back',
  },
  volume: {
    volume: 'Master volume',
    music: 'Music',
    sfx: 'Effects',
  },
  loading: (percent: number) => `Loading ${percent}%`,
  tapToContinue: 'Tap to continue',
  fullscreenHint: 'To play full screen: Share → Add to Home Screen',
  github: 'GitHub repository',
  githubStar: 'We’d be grateful if you starred us on GitHub',
  thanks: 'Thank you for playing!',
  credits: {
    title: 'Credits',
    authors: {
      '@nikolayivakhnenko': 'Nikolay Ivakhnenko',
      '@displiceat': 'Elizaveta Makarova',
    },
    music: (author: string, title: string) => `Menu music: ${author}, “${title}”`,
  },
  vote: {
    labels: {
      A: 'Keep the pregnancy',
      B: 'End the pregnancy',
    },
    scale: {
      A: 'keep the pregnancy',
      B: 'end the pregnancy',
    },
    chosen: 'You chose',
    counting: 'Counting votes...',
    unavailable: 'Statistics are unavailable right now',
    pending: 'Your vote will be counted once you’re back online',
    total: (n: number) => `${n.toLocaleString('en-US')} ${plural.select(n) === 'one' ? 'vote' : 'votes'} in total`,
  },
  email: {
    intro: 'Too few people have played so far to show how others chose. ' +
      'Leave your email and we’ll write when the statistics are in.',
    thanks: 'Thank you! We’ll write as soon as the statistics are in.',
    invalid: 'Please check the email address',
    failed: 'Couldn’t send it, please try again',
    sending: 'Sending...',
    send: 'Send',
  },
  play: {
    loadFailed: 'Couldn’t load the story',
    retry: 'Try again',
    menu: 'Main menu',
    update: 'A new version of the story is available',
    updateAction: 'Update',
    storyUpdated: 'The story was updated, starting over',
    saveBroken: 'The save is damaged, starting over',
  },
  otherVersion: {
    text: 'English version',
    action: 'Open',
  },
}

export default en
