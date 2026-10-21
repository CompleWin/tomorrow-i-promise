import { StyleSheet, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import app from '../../app.json'
import { useCallback, useState } from 'react'
import { clearSave, loadSave } from '@/novel/storage'
import { Stage } from '@/novel/components/Stage'
import UIText from '@/novel/components/UIText'
import MenuItem from '@/novel/components/MenuItem'
import { useFade } from '@/novel/components/Fade'
import { COLORS } from '@/novel/theme'

export default function Index () {

  const [hasSave, setHasSave] = useState<boolean | null>(null)
  const fade = useFade()

  useFocusEffect(
    useCallback(() => {
      loadSave().then(save => setHasSave(save !== null))
      if (fade.isBlack()) {
        fade.to(0, 700)
      }
    }, [fade]),
  )

  async function play () {
    await fade.to(1, 600)
    router.push('/play')
  }

  async function restart () {
    await clearSave()
    setHasSave(false)
    await play()
  }

  return (
    <Stage>
      <View style={styles.screen}>
        <UIText size={132} color={COLORS.cream} style={styles.title}>{app.expo.name}</UIText>

        {hasSave === null && (
          <UIText size={52} color={COLORS.cream2}>Загрузка, пожалуйста подождите</UIText>
        )
        }

        {hasSave === false && (
          <MenuItem label="Начать" active onPress={play} />
        )
        }

        {hasSave === true && (
          <>
            <MenuItem label="Продолжить" active onPress={play} />
            <MenuItem label="Начать заново" onPress={restart} />
          </>
        )
        }

      </View>
    </Stage>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 240,
  },
  title: {
    marginBottom: 80,
  },
})
