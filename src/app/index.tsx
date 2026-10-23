import { BackHandler, StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { cachedVersion, fetchManifest } from '@/novel/content'
import { assetUrl } from '@/novel/config'
import { menuArtFor, MENU_ART_COMPLETED, MENU_MUSIC } from '@/novel/menuArt'
import { playMusic, startSound } from '@/novel/sound'
import { clearSave, loadCompleted, loadSave } from '@/novel/storage'
import { useFade } from '@/novel/components/Fade'
import MenuBackground from '@/novel/components/MenuBackground'
import MenuFooter from '@/novel/components/MenuFooter'
import MenuItem from '@/novel/components/MenuItem'
import VolumeSettings, { useVolumeSettings } from '@/novel/components/VolumeSettings'
import { Stage } from '@/novel/components/Stage'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'
import useMenuSelection, { MenuAction } from '@/novel/useMenuSelection'

type Menu = {
  hasSave: boolean
  act: number | null
  completed: boolean
  version: string | null
}

type MenuView = 'main' | 'settings'

async function loadMenu (): Promise<Menu> {
  const [save, completed] = await Promise.all([loadSave(), loadCompleted()])
  return {
    hasSave: save !== null,
    act: save?.act ?? null,
    completed: completed !== null,
    version: save?.contentVersion ?? await cachedVersion(),
  }
}

export default function Index () {

  const [menu, setMenu] = useState<Menu | null>(null)
  const [latest, setLatest] = useState<string | null>(null)
  const [view, setView] = useState<MenuView>('main')
  const [focused, setFocused] = useState(false)
  const fade = useFade()
  const shown = useSharedValue(0)
  const items = useSharedValue(1)
  const loaded = menu !== null

  useEffect(() => {
    if (loaded) {
      shown.set(withTiming(1, { duration: 400 }))
    }
  }, [loaded, shown])

  const columnStyle = useAnimatedStyle(() => ({
    opacity: shown.get(),
  }))
  const itemsStyle = useAnimatedStyle(() => ({
    opacity: items.get(),
  }))

  useFocusEffect(
    useCallback(() => {
      let cancelled = false
      setFocused(true)
      startSound()
      loadMenu().then(data => {
        if (!cancelled) {
          setMenu(data)
          playMusic(assetUrl(MENU_MUSIC.file, data.version), MENU_MUSIC)
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
    }, [fade]),
  )

  async function open (path: '/play' | '/credits' | '/stats') {
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
    { label: 'Назад', onPress: () => switchView('main') },
  ] : [
    ...(menu.hasSave ? [
      { label: 'Продолжить', onPress: () => open('/play') },
      { label: 'Начать заново', onPress: restart },
    ] : [
      { label: 'Начать', onPress: restart },
    ]),
    ...(menu.completed ? [{ label: 'Статистика', onPress: () => open('/stats') }] : []),
    { label: 'Настройки', onPress: () => switchView('settings') },
    { label: 'Авторы', onPress: () => open('/credits') },
  ]

  const { selected, select } = useMenuSelection([...volumeRows, ...entries], { screen: view, enabled: focused })

  const art = menu?.completed ? MENU_ART_COMPLETED : menuArtFor(menu?.act ?? null)

  return (
    <Stage>
      {menu !== null && <MenuBackground art={art} version={menu.version} />}

      <Animated.View style={[styles.column, columnStyle]}>
        <View style={styles.title}>
          <View>
            <UIText size={132} color={COLORS.cream}>Завтра</UIText>
            <UIText size={132} color={COLORS.cream}>точно</UIText>
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
