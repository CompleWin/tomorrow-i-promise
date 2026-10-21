import { StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { cachedVersion } from '@/novel/content'
import { menuArtFor, MENU_ART_COMPLETED } from '@/novel/menuArt'
import { clearSave, loadCompleted, loadSave } from '@/novel/storage'
import { useBanner } from '@/novel/components/Banner'
import { useFade } from '@/novel/components/Fade'
import MenuBackground from '@/novel/components/MenuBackground'
import MenuItem from '@/novel/components/MenuItem'
import { Stage } from '@/novel/components/Stage'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

type Menu = {
  hasSave: boolean
  act: number | null
  completed: boolean
  version: string | null
}

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
  const fade = useFade()
  const banner = useBanner()
  const shown = useSharedValue(0)
  const loaded = menu !== null

  useEffect(() => {
    if (loaded) {
      shown.set(withTiming(1, { duration: 400 }))
    }
  }, [loaded, shown])

  const columnStyle = useAnimatedStyle(() => ({
    opacity: shown.get(),
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

  function settings () {
    banner.show('Настройки появятся в следующей версии', { duration: 3200 })
  }

  const art = menu?.completed ? MENU_ART_COMPLETED : menuArtFor(menu?.act ?? null)

  return (
    <Stage>
      {menu !== null && <MenuBackground art={art} version={menu.version} />}

      <Animated.View style={[styles.column, columnStyle]}>
        <View style={styles.title}>
          <UIText size={30} spacing={0.06} color={COLORS.kicker}>визуальная новелла</UIText>
          <View>
            <UIText size={132} color={COLORS.cream}>Завтра</UIText>
            <UIText size={132} color={COLORS.cream}>точно</UIText>
          </View>
        </View>

        {menu !== null && (
          <View>
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
            <MenuItem label={'Настройки'} onPress={settings} />
            <MenuItem label={'Авторы'} onPress={() => open('/credits')} />
          </View>
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
