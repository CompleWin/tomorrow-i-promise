import { Pressable, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

export const STEP = 10
const CELLS = 100 / STEP

type Props = {
  label: string
  value: number
  selected: boolean
  onHover: () => void
  onChange: (value: number) => void
}

function StepButton ({ sign, onPress }: { sign: string, onPress: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Pressable onPress={onPress}
               onHoverIn={() => setHovered(true)}
               onHoverOut={() => setHovered(false)}
               style={styles.button}
    >
      {({ pressed }) => (
        <UIText size={52} color={hovered || pressed ? COLORS.lamp : COLORS.cream2}>{sign}</UIText>
      )}
    </Pressable>
  )
}

export default function VolumeControl ({ label, value, selected, onHover, onChange }: Props) {
  const lit = Math.round(value / STEP)

  return (
    <Pressable onHoverIn={onHover} style={styles.control}>
      <UIText size={52} color={selected ? COLORS.lamp : COLORS.cream2} style={styles.label}>{label}</UIText>
      <View style={styles.row}>
        <StepButton sign={'−'} onPress={() => onChange(value - STEP)} />
        {Array.from({ length: CELLS }, (_, i) => (
          <Pressable key={i} onPress={() => onChange((i + 1) * STEP)} style={styles.hit}>
            <View style={[styles.cell, i < lit && styles.cellOn]} />
          </Pressable>
        ))}
        <StepButton sign={'+'} onPress={() => onChange(value + STEP)} />
        <UIText size={52} color={COLORS.lamp} style={styles.value}>{`${value}%`}</UIText>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'auto',
  },
  label: {
    width: 580,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 90,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hit: {
    width: 44,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: 30,
    height: 52,
    backgroundColor: COLORS.cellOff,
  },
  cellOn: {
    backgroundColor: COLORS.lamp,
  },
  value: {
    marginLeft: 30,
    minWidth: 160,
  },
})
