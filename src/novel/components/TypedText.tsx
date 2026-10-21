import { StyleSheet, Text } from 'react-native'

export default function TypedText ({ text, shown }: { text: string, shown: number }) {
  return (
    <>
      {text.slice(0, shown)}
      <Text style={styles.rest}>{text.slice(shown)}</Text>
    </>
  )
}

const styles = StyleSheet.create({
  rest: {
    color: 'transparent',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0.01,
  },
})
