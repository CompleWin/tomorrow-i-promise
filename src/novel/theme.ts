import { Easing } from 'react-native-reanimated'

export const COLORS = {
  inkBlack: '#050403',
  cream: '#f1e4cc',
  lamp: '#f9dda8',
  cream2: '#d9c9ae',
  narration: '#cdb894',
  kicker: '#c9b597',
  sub: '#b9a68a',
  muted: '#a8977e',
  note: '#8a7a64',
  cellOff: 'rgba(241,228,204,.14)',
  brushRed: '#69312c',

  dimChoice: 'rgba(6,4,3,.45)',
  pauseBtn: 'rgba(6,4,3,.6)',
  pauseBtnPressed: 'rgba(6,4,3,.85)',
  pauseOverlay: 'rgba(5,4,3,.8)',
  creditsDim: 'rgba(5,4,3,.5)',
  resultDim: 'rgba(5,4,3,.2)',
}

export const FONT = 'Galmuri11'

export const IDLE_OPACITY = 0.45

export const EASE = {
  out: Easing.bezier(0.2, 0.8, 0.2, 1),
  wipe: Easing.bezier(0.3, 0.7, 0.2, 1),
  close: Easing.bezier(0.25, 0.6, 0.3, 1),
  inOut: Easing.bezier(0.42, 0, 0.58, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  easeIn: Easing.bezier(0.42, 0, 1, 1),
  move: Easing.bezier(0.65, 0, 0.35, 1),
}

export const TEXT_SPEED = 1

export const TYPE_DELAY = {
  start: 160,
  char: 28,
  stop: 260,
  pause: 110,
}

export const TEXT_DELAY: Record<string, number> = {
  default: 250,
  fadeIn: 600,
  close: 700,
  blackout: 1100,
  lightsOn: 700,
  move: 900,
}

export const BG_DURATION: Record<string, number> = {
  default: 700,
  fadeIn: 1400,
  close: 1600,
  blackout: 1500,
  lightsOn: 1000,
  move: 1200,
  frame: 1100,
}

export const FRAME_STEP = 800
