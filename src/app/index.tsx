import { Text, Pressable, StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'
import app from '../../app.json'

export default function Index() {
  return (
    <>
      <View style={styles.screen}>
        <Text>{app.expo.name}</Text>
        <Link href="/play" asChild>
          <Pressable style={styles.start}>
            <Text style={styles.startText}>Начать</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 12
  },
  start: {
    minWidth: 240,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  startText: {
    color: '#fff',
  }
})