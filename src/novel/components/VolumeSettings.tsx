import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { setLevels } from '@/novel/sound'
import { loadSettings, Settings, writeSettings } from '@/novel/storage'
import VolumeControl from '@/novel/components/VolumeControl'

const CONTROLS: { key: keyof Settings, label: string }[] = [
  { key: 'volume', label: 'Общая громкость' },
  { key: 'music', label: 'Музыка' },
  { key: 'sfx', label: 'Эффекты' },
]

export default function VolumeSettings () {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    let cancelled = false
    loadSettings().then(loaded => {
      if (!cancelled) {
        setSettings(loaded)
      }
    })
    return () => { cancelled = true }
  }, [])

  if (settings === null) {
    return <View style={styles.placeholder} />
  }

  const change = (key: keyof Settings, value: number) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    setLevels(next)
    writeSettings(next)
  }

  return (
    <View>
      {CONTROLS.map(({ key, label }) => (
        <VolumeControl key={key}
                       label={label}
                       value={settings[key]}
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
