import { StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'

export default function End () {

  return (
    <View style={styles.end}>
      <Link href="/" style={styles.endText}>
        Конец
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  end: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  endText: {
    fontSize: 20,
    color: '#fff',
  }
})