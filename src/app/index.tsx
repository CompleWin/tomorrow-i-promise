import { Text, Pressable, StyleSheet, View } from 'react-native'
import { Link, router, useFocusEffect } from 'expo-router'
import app from '../../app.json'
import { useCallback, useState } from 'react'
import { clearSave, loadSave } from '@/novel/storage'

export default function Index () {

  const [hasSave, setHasSave] = useState<boolean | null>(null)

  useFocusEffect(
    useCallback(() => {
      loadSave().then(save => setHasSave(save !== null))
    }, []),
  )

  async function restart () {
    await clearSave()
    setHasSave(false)
    router.push('/play')
  }

  return (
    <>
      <View style={styles.screen}>
        <Text>{app.expo.name}</Text>

        {hasSave === null && (
          <Text style={styles.start}>Загрузка, пожалуйста подождите</Text>
        )
        }

        {hasSave === false && (
          <Link href="/play" asChild>
            <Pressable style={styles.start}>
              <Text style={styles.startText}>Начать</Text>
            </Pressable>
          </Link>
        )
        }

        {hasSave === true && (
          <>
            <Link href="/play" asChild>
              <Pressable style={styles.start}>
                <Text style={styles.startText}>Продолжить</Text>
              </Pressable>
            </Link>
            <Pressable style={styles.start}
                       onPress={restart}
            >
              <Text style={styles.startText}>Начать заново</Text>
            </Pressable>
          </>
        )
        }

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 12,
  },
  start: {
    minWidth: 240,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  startText: {
    color: '#fff',
  },
})