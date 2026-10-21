import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { useState, useSyncExternalStore } from 'react'
import { useBanner } from '@/novel/components/Banner'
import { COLORS } from '@/novel/theme'

const HINT = 'Чтобы играть на весь экран: «Поделиться» → «На экран «Домой»»'

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>
}

const QUERIES = ['(display-mode: standalone)', '(display-mode: fullscreen)']

function subscribe (onChange: () => void) {
  if (Platform.OS !== 'web') {
    return () => {}
  }
  const lists = QUERIES.map(q => window.matchMedia(q))
  lists.forEach(l => l.addEventListener('change', onChange))
  document.addEventListener('fullscreenchange', onChange)
  document.addEventListener('webkitfullscreenchange', onChange)
  return () => {
    lists.forEach(l => l.removeEventListener('change', onChange))
    document.removeEventListener('fullscreenchange', onChange)
    document.removeEventListener('webkitfullscreenchange', onChange)
  }
}

function shouldOffer () {
  if (Platform.OS !== 'web') {
    return false
  }
  const doc = document as FullscreenDocument
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true
  const fullscreen = (doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null) !== null
  return !standalone && !fullscreen
}

function enterFullscreen (): boolean {
  const el = document.documentElement as FullscreenElement
  const request = el.requestFullscreen ?? el.webkitRequestFullscreen
  if (request === undefined) {
    return false
  }
  Promise.resolve(request.call(el))
    .then(() => (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape'))
    .catch(() => {})
  return true
}

export default function FullscreenButton () {
  const offer = useSyncExternalStore(subscribe, shouldOffer, () => false)
  const banner = useBanner()
  const [hovered, setHovered] = useState(false)

  if (!offer) {
    return null
  }

  const press = () => {
    if (!enterFullscreen()) {
      banner.show(HINT, { duration: 5000 })
    }
  }

  return (
    <Pressable onPress={press}
               onHoverIn={() => setHovered(true)}
               onHoverOut={() => setHovered(false)}
               style={styles.zone}
    >
      {({ pressed }) => (
        <View style={[styles.square, (hovered || pressed) && styles.squarePressed]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      )}
    </Pressable>
  )
}

const INSET = 16
const ARM = 20
const LINE = 6

const styles = StyleSheet.create({
  zone: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingVertical: 30,
    paddingHorizontal: 34,
  },
  square: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.pauseBtn,
  },
  squarePressed: {
    backgroundColor: COLORS.pauseBtnPressed,
  },
  corner: {
    position: 'absolute',
    width: ARM,
    height: ARM,
    borderColor: COLORS.cream,
  },
  topLeft: {
    left: INSET,
    top: INSET,
    borderLeftWidth: LINE,
    borderTopWidth: LINE,
  },
  topRight: {
    right: INSET,
    top: INSET,
    borderRightWidth: LINE,
    borderTopWidth: LINE,
  },
  bottomLeft: {
    left: INSET,
    bottom: INSET,
    borderLeftWidth: LINE,
    borderBottomWidth: LINE,
  },
  bottomRight: {
    right: INSET,
    bottom: INSET,
    borderRightWidth: LINE,
    borderBottomWidth: LINE,
  },
})
