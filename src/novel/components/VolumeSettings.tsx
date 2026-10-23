import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { setLevels } from '@/novel/sound'
import { loadSettings, Settings, writeSettings } from '@/novel/storage'
import type { MenuAction } from '@/novel/useMenuSelection'
import VolumeControl, { STEP } from '@/novel/components/VolumeControl'

const CONTROLS: { key: keyof Settings, label: string }[] = [
  { key: 'volume', label: 'Общая громкость' },
  { key: 'music', label: 'Музыка' },
  { key: 'sfx', label: 'Эффекты' },
]

export function useVolumeSettings (active: boolean) {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    if (!active) {
      return
    }
    let cancelled = false
    loadSettings().then(loaded => {
      if (!cancelled) {
        setSettings(loaded)
      }
    })
    return () => { cancelled = true }
  }, [active])

  const change = (key: keyof Settings, value: number) => {
    if (settings === null) {
      return
    }
    const next = { ...settings, [key]: Math.min(100, Math.max(0, value)) }
    setSettings(next)
    setLevels(next)
    writeSettings(next)
  }

  const actions: MenuAction[] = settings === null ? [] : CONTROLS.map(({ key, label }) => ({
    label,
    onPress: () => {},
    onAdjust: delta => change(key, settings[key] + delta * STEP),
  }))

  return { settings, change, actions }
}

type Props = {
  volume: ReturnType<typeof useVolumeSettings>
  selected: number
  onHover: (index: number) => void
}

export default function VolumeSettings ({ volume, selected, onHover }: Props) {
  const { settings, change } = volume

  if (settings === null) {
    return <View style={styles.placeholder} />
  }

  return (
    <View>
      {CONTROLS.map(({ key, label }, index) => (
        <VolumeControl key={key}
                       label={label}
                       value={settings[key]}
                       selected={index === selected}
                       onHover={() => onHover(index)}
                       onChange={value => change(key, value)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    height: 110 * CONTROLS.length,
  },
})
