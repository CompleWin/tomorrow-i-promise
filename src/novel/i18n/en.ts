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
  githubStar: "We'd really appreciate a star on GitHub",
  thanks: 'Thank you for playing!',
  credits: {
    title: 'Credits',
    authors: {
      '@nikolayivakhnenko': 'Nikolai Ivakhnenko',
      '@displiceat': 'Elizaveta Makarova',
    },
    music: (author: string, title: string) => `Menu music: ${author}, “${title}”`,
  },
  vote: {
    labels: {
      A: 'Continue the pregnancy',
      B: 'Terminate the pregnancy',
    },
    scale: {
      A: 'continue the pregnancy',
      B: 'terminate the pregnancy',
    },
    chosen: 'You chose',
    counting: 'Counting votes...',
    unavailable: 'Statistics are unavailable right now',
    pending: "Your vote will be counted once you're back online",
    total: (n: number) => `${n.toLocaleString('en-US')} ${plural.select(n) === 'one' ? 'vote' : 'votes'} in total`,
  },
  email: {
    intro: 'Not enough people have played yet to show how others chose. ' +
      "Leave your email and we'll let you know once we have the results.",
    thanks: "Thank you! We'll let you know as soon as we have the results.",
    invalid: 'Please check your email address',
    failed: "Couldn't send. Please try again",
    sending: 'Sending...',
    send: 'Send',
  },
  play: {
    loadFailed: "Couldn't load the story",
    retry: 'Try again',
    menu: 'Main menu',
    update: 'A new version of the story is available',
    updateAction: 'Update',
    storyUpdated: 'The story has been updated. Starting from the beginning',
    saveBroken: 'Your save is corrupted. Starting from the beginning',
  },
  otherVersion: {
    text: 'English version',
    action: 'Open',
  },
}

export default en
