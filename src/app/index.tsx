import { BackHandler, StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { cachedVersion } from '@/novel/content'
import { menuArtFor, MENU_ART_COMPLETED } from '@/novel/menuArt'
import { clearSave, loadCompleted, loadSave } from '@/novel/storage'
import { useFade } from '@/novel/components/Fade'
import MenuBackground from '@/novel/components/MenuBackground'
import MenuItem from '@/novel/components/MenuItem'
import VolumeSettings from '@/novel/components/VolumeSettings'
import { Stage } from '@/novel/components/Stage'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

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
  const [view, setView] = useState<MenuView>('main')
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
      loadMenu().then(data => {
        if (!cancelled) {
          setMenu(data)
        }
      })
      if (fade.isBlack()) {
        fade.to(0, 700)
      }
      return () => { cancelled = true }
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

        {menu !== null && view === 'settings' && (
          <Animated.View style={itemsStyle}>
            <VolumeSettings />
            <MenuItem label={'Назад'} onPress={() => switchView('main')} />
          </Animated.View>
        )}

        {menu !== null && view === 'main' && (
          <Animated.View style={itemsStyle}>
            {menu.hasSave ? (
              <>
                <MenuItem label={'Продолжить'} active onPress={() => open('/play')} />
                <MenuItem label={'Начать заново'} onPress={restart} />
              </>
            ) : (
              <MenuItem label={'Начать'} active onPress={restart} />
            )}
            {menu.completed && (
              <MenuItem label={'Статистика'} onPress={() => open('/stats')} />
            )}
            <MenuItem label={'Настройки'} onPress={() => switchView('settings')} />
            <MenuItem label={'Авторы'} onPress={() => open('/credits')} />
          </Animated.View>
        )}
      </Animated.View>
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
