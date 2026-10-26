import { BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import type { Href } from 'expo-router'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { cachedVersion, fetchManifest, warmStory } from '@/novel/content'
import { assetUrl } from '@/novel/config'
import { menuArtFor, MENU_ART_COMPLETED, MENU_MUSIC } from '@/novel/menuArt'
import { musicReady, playMusic, prepareMusic, startSound } from '@/novel/sound'
import { clearSave, loadCompleted, loadSave } from '@/novel/storage'
import { Lang, langPath, STRINGS } from '@/novel/i18n'
import { useBanner } from '@/novel/components/Banner'
import { useFade } from '@/novel/components/Fade'
import HomeHead from '@/novel/components/HomeHead'
import LanguageButton from '@/novel/components/LanguageButton'
import { useLocale } from '@/novel/components/Locale'
import MenuBackground from '@/novel/components/MenuBackground'
import MenuFooter from '@/novel/components/MenuFooter'
import MenuItem from '@/novel/components/MenuItem'
import LoadingScene from '@/novel/components/LoadingScene'
import VolumeSettings, { useVolumeSettings } from '@/novel/components/VolumeSettings'
import { Stage } from '@/novel/components/Stage'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'
import useMenuSelection, { MenuAction } from '@/novel/useMenuSelection'
import useTapKeys from '@/novel/useTapKeys'

type Menu = {
  hasSave: boolean
  act: number | null
  currentBg: string | null
  completed: boolean
  version: string | null
}

type MenuView = 'main' | 'settings'

const REVEAL_WAIT_MS = 8 * 1000
const REVEAL_MS = 500
const SUGGEST_MS = 8 * 1000

let entered = false
let revealed: Menu | null = null

async function loadMenu (lang: Lang): Promise<Menu> {
  const [save, completed] = await Promise.all([loadSave(), loadCompleted()])
  return {
    hasSave: save !== null,
    act: save?.act ?? null,
    currentBg: save?.currentBg ?? null,
    completed: completed !== null,
    version: save?.contentVersion ?? await cachedVersion(lang),
  }
}

export default function MainMenu () {
  const { lang, t, suggested, dismissSuggestion } = useLocale()
  const banner = useBanner()
  const suggestion = useRef<number | null>(null)
  const [menu, setMenu] = useState<Menu | null>(revealed)
  const [latest, setLatest] = useState<string | null>(null)
  const [view, setView] = useState<MenuView>('main')
  const [focused, setFocused] = useState(false)
  const [artReady, setArtReady] = useState(revealed !== null)
  const [soundReady, setSoundReady] = useState(revealed !== null)
  const [late, setLate] = useState(false)
  const [loader, setLoader] = useState(revealed === null)
  const [intro, setIntro] = useState(!entered)
  const fade = useFade()
  const shown = useSharedValue(revealed === null ? 0 : 1)
  const items = useSharedValue(1)
  const loaded = menu !== null && ((artReady && soundReady) || late)
  const opened = loaded && !intro
  const menuProgress = () => loaded ? 1 : [menu !== null, artReady, soundReady].filter(Boolean).length / 3

  function enter () {
    if (!loaded || !intro) {
      return
    }
    entered = true
    setIntro(false)
  }

  useTapKeys(enter, loaded && intro)

  useEffect(() => {
    if (!opened || !focused || menu === null) {
      return
    }
    playMusic(assetUrl(MENU_MUSIC.file, menu.version), MENU_MUSIC)
    warmStory(lang, menu.act ?? 1, menu.currentBg)
  }, [opened, focused, menu, lang])

  useEffect(() => {
    if (!opened || !focused || suggested === null) {
      return
    }
    const strings = STRINGS[suggested]
    suggestion.current = banner.show(strings.otherVersion.text, {
      action: strings.otherVersion.action,
      duration: SUGGEST_MS,
      onPress: () => {
        banner.hide()
        router.replace(langPath(suggested) as Href)
      },
    })
    dismissSuggestion()
  }, [opened, focused, suggested, banner, dismissSuggestion])

  useEffect(() => {
    if (focused || suggestion.current === null) {
      return
    }
    banner.hide(suggestion.current)
    suggestion.current = null
  }, [focused, banner])

  const markArtReady = useCallback(() => setArtReady(true), [])

  useEffect(() => {
    if (menu === null) {
      return
    }
    let cancelled = false
    musicReady().then(() => {
      if (!cancelled) {
        setSoundReady(true)
      }
    })
    const timer = setTimeout(() => setLate(true), REVEAL_WAIT_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [menu])

  useEffect(() => {
    if (!opened) {
      return
    }
    revealed = menu
    shown.set(withTiming(1, { duration: REVEAL_MS }))
    const timer = setTimeout(() => setLoader(false), REVEAL_MS)
    return () => clearTimeout(timer)
  }, [opened, shown, menu])

  const columnStyle = useAnimatedStyle(() => ({
    opacity: shown.get(),
  }))
  const loaderStyle = useAnimatedStyle(() => ({
    opacity: 1 - shown.get(),
  }))
  const itemsStyle = useAnimatedStyle(() => ({
    opacity: items.get(),
  }))

  useFocusEffect(
    useCallback(() => {
      let cancelled = false
      setFocused(true)
      startSound()
      loadMenu(lang).then(data => {
        if (!cancelled) {
          prepareMusic(assetUrl(MENU_MUSIC.file, data.version), MENU_MUSIC)
          setMenu(data)
        }
      })
      fetchManifest().then(manifest => {
        if (!cancelled) {
          setLatest(manifest.version)
        }
      }).catch(error => console.warn('manifest failed', error))
      if (fade.isBlack()) {
        fade.to(0, 700)
      }
      return () => {
        cancelled = true
        setFocused(false)
      }
    }, [fade, lang]),
  )

  async function open (path: '/play' | '/credits' | '/stats') {
    if (path === '/play') {
      playMusic(null)
    }
    await fade.to(1, 600)
    router.push(path)
  }

  async function restart () {
    await clearSave()
    await open('/play')
  }

  function switchView (next: MenuView) {
    items.set(0)
    items.set(withTiming(1, { duration: 300 }))
    setView(next)
  }

  const onBack = useEffectEvent(() => {
    if (view !== 'settings') {
      return false
    }
    switchView('main')
    return true
  })

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack)
    return () => subscription.remove()
  }, [])

  const volume = useVolumeSettings(view === 'settings')
  const volumeRows = view === 'settings' ? volume.actions : []

  const entries: MenuAction[] = menu === null ? [] : view === 'settings' ? [
    { label: t.menu.back, onPress: () => switchView('main') },
  ] : [
    ...(menu.hasSave ? [
      { label: t.menu.continue, onPress: () => open('/play') },
      { label: t.menu.restart, onPress: restart },
    ] : [
      { label: t.menu.start, onPress: restart },
    ]),
    ...(menu.completed ? [{ label: t.menu.stats, onPress: () => open('/stats') }] : []),
    { label: t.menu.settings, onPress: () => switchView('settings') },
    { label: t.menu.credits, onPress: () => open('/credits') },
  ]

  const { selected, select } = useMenuSelection([...volumeRows, ...entries], { screen: view, enabled: focused && opened })

  const art = menu?.completed ? MENU_ART_COMPLETED : menuArtFor(menu?.act ?? null)

  return (
    <Stage>
      {Platform.OS === 'web' && <HomeHead lang={lang} />}

      {menu !== null && (
        <Animated.View style={[StyleSheet.absoluteFill, columnStyle]}>
          <MenuBackground art={art} version={menu.version} onReady={markArtReady} />
        </Animated.View>
      )}

      <Animated.View style={[styles.column, columnStyle]}>
        <View style={styles.title}>
          <View>
            {t.title.map(line => (
              <UIText key={line} size={132} color={COLORS.cream}>{line}</UIText>
            ))}
          </View>
        </View>

        {menu !== null && (
          <Animated.View style={itemsStyle}>
            {view === 'settings' && <VolumeSettings volume={volume} selected={selected} onHover={select} />}
            {entries.map((action, index) => (
              <MenuItem key={action.label}
                        label={action.label}
                        selected={volumeRows.length + index === selected}
                        onHover={() => select(volumeRows.length + index)}
                        onPress={action.onPress}
              />
            ))}
          </Animated.View>
        )}
      </Animated.View>

      {menu !== null && (
        <Animated.View pointerEvents={'box-none'} style={[StyleSheet.absoluteFill, columnStyle]}>
          <MenuFooter version={latest ?? menu.version} />
          <LanguageButton onChange={next => warmStory(next, menu.act ?? 1, menu.currentBg)} />
        </Animated.View>
      )}

      {loader && (
        <Animated.View pointerEvents={opened ? 'none' : 'auto'} style={[StyleSheet.absoluteFill, loaderStyle]}>
          <Pressable onPress={enter} style={StyleSheet.absoluteFill}>
            <LoadingScene progress={menuProgress} ready={loaded && intro} />
          </Pressable>
        </Animated.View>
      )}
    </Stage>
  )
}

const styles = StyleSheet.create({
  column: {
    ...StyleSheet.absoluteFill,
    left: 150,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 84,
  },
  title: {
    gap: 28,
  },
})
