import { View, StyleSheet, Pressable, Text } from 'react-native'

type Props = {
  choices: {
    index: number;
    text: string
  }[]
  onChoose: (index: number) => void
}

export default function ChoiceList ({ choices, onChoose }: Props) {
  return (
    <View style={styles.list}>
      {choices.map((choice) => (
        <Pressable key={choice.index} style={styles.button}
                   onPress={() => onChoose(choice.index)}>
          <Text style={styles.label}>{choice.text}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    minWidth: 240,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  label: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 26,
  },
})