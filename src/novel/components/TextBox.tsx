import { StyleSheet, View, Text } from 'react-native'

type Props = {
  speaker: string | null
  text: string
}

export function TextBox ({ speaker, text }: Props) {
  return (
    <View style={styles.box}>
      {speaker && <Text style={styles.speaker}>{speaker}</Text>}
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    maxWidth: 900,
    alignSelf: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  speaker: {
    color: '#ffd27f',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 26,
  }
})