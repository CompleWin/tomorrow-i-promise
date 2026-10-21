import { Pressable, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { setVolume } from '@/novel/sound'
import { loadSettings, writeSettings } from '@/novel/storage'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

const STEP = 10
const CELLS = 100 / STEP

type Props = {
  label: string
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

export default function VolumeControl ({ label }: Props) {
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    loadSettings().then(settings => {
      if (!cancelled) {
        setValue(settings.volume)
      }
    })
    return () => { cancelled = true }
  }, [])

  if (value === null) {
    return <View style={styles.placeholder} />
  }

  const lit = Math.round(value / STEP)
  const set = (next: number) => {
    const volume = Math.min(100, Math.max(0, next))
    setValue(volume)
    setVolume(volume)
    writeSettings({ volume })
  }

  return (
    <View style={styles.control}>
      <UIText size={52} color={COLORS.cream2}>{label}</UIText>
      <View style={styles.row}>
        <StepButton sign={'−'} onPress={() => set(value - STEP)} />
        {Array.from({ length: CELLS }, (_, i) => (
          <Pressable key={i} onPress={() => set((i + 1) * STEP)} style={styles.hit}>
            <View style={[styles.cell, i < lit && styles.cellOn]} />
          </Pressable>
        ))}
        <StepButton sign={'+'} onPress={() => set(value + STEP)} />
        <UIText size={52} color={COLORS.lamp} style={styles.value}>{`${value}%`}</UIText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    height: 178,
  },
  control: {
    paddingLeft: 36,
    gap: 8,
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
