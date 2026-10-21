import { View, StyleSheet, Pressable, Text } from 'react-native'
import { FONT } from '@/novel/theme'

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
    gap: 30,
  },
  button: {
    minWidth: 600,
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  label: {
    color: '#fff',
    fontFamily: FONT,
    fontSize: 44,
    lineHeight: 60,
  },
})