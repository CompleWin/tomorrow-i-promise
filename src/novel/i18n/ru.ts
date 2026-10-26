const ru = {
  title: ['Завтра', 'точно'],
  menu: {
    continue: 'Продолжить',
    restart: 'Начать заново',
    start: 'Начать',
    stats: 'Статистика',
    settings: 'Настройки',
    credits: 'Авторы',
    back: 'Назад',
  },
  pause: {
    title: 'Пауза',
    settings: 'Настройки',
    resume: 'Продолжить',
    menu: 'В меню',
    back: 'Назад',
  },
  volume: {
    volume: 'Общая громкость',
    music: 'Музыка',
    sfx: 'Эффекты',
  },
  loading: (percent: number) => `Загрузка ${percent}%`,
  tapToContinue: 'Нажмите, чтобы продолжить',
  fullscreenHint: 'Чтобы играть на весь экран: Поделиться → На экран Домой',
  github: 'Репозиторий на GitHub',
  githubStar: 'Будем благодарны, если вы поставите звезду на GitHub',
  thanks: 'Спасибо за игру!',
  credits: {
    title: 'Авторы',
    authors: {
      '@nikolayivakhnenko': 'Ивахненко Николай',
      '@displiceat': 'Макарова Елизавета',
    },
    music: (author: string, title: string) => `Музыка в меню: ${author}, «${title}»`,
  },
  vote: {
    labels: {
      A: 'Сохранить беременность',
      B: 'Прервать беременность',
    },
    scale: {
      A: 'сохранить беременность',
      B: 'прервать беременность',
    },
    chosen: 'Вы выбрали',
    counting: 'Считаем голоса...',
    unavailable: 'Статистика сейчас недоступна',
    pending: 'Голос будет учтён, когда появится связь',
    total: (n: number) => `Всего голосов — ${n.toLocaleString('ru-RU')}`,
  },
  email: {
    intro: 'Пока сыграло слишком мало игроков, чтобы показать, как выбрали другие. ' +
      'Оставьте почту, и мы напишем, когда соберём статистику.',
    thanks: 'Спасибо! Напишем, как только соберём статистику.',
    invalid: 'Проверьте адрес почты',
    failed: 'Не получилось отправить, попробуйте ещё раз',
    sending: 'Отправляем...',
    send: 'Отправить',
  },
  play: {
    loadFailed: 'Не удалось загрузить историю',
    retry: 'Повторить',
    menu: 'В меню',
    update: 'Доступна новая версия истории',
    updateAction: 'Обновить',
    storyUpdated: 'История обновилась, начинаем сначала',
    saveBroken: 'Сохранение повреждено, начинаем сначала',
  },
  otherVersion: {
    text: 'Русская версия',
    action: 'Открыть',
  },
}

export type Strings = typeof ru

export default ru
