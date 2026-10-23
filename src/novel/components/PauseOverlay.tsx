import { BackHandler, Pressable, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import MenuItem from '@/novel/components/MenuItem'
import UIText from '@/novel/components/UIText'
import VolumeSettings, { useVolumeSettings } from '@/novel/components/VolumeSettings'
import { COLORS } from '@/novel/theme'
import useMenuSelection, { MenuAction } from '@/novel/useMenuSelection'

type Props = {
  onResume: () => void
  onMenu: () => void
}

export default function PauseOverlay ({ onResume, onMenu }: Props) {
  const [settings, setSettings] = useState(false)

  useEffect(() => {
    if (!settings) {
      return
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setSettings(false)
      return true
    })
    return () => subscription.remove()
  }, [settings])

  const volume = useVolumeSettings(settings)
  const volumeRows = settings ? volume.actions : []

  const entries: MenuAction[] = settings ? [
    { label: 'Назад', onPress: () => setSettings(false) },
  ] : [
    { label: 'Продолжить', onPress: onResume },
    { label: 'Настройки', onPress: () => setSettings(true) },
    { label: 'В меню', onPress: onMenu },
  ]

  const { selected, select } = useMenuSelection([...volumeRows, ...entries], { screen: settings ? 'settings' : 'pause' })

  return (
    <Pressable onPress={settings ? () => setSettings(false) : onResume} style={styles.overlay}>
      <View style={styles.column}>
        <UIText size={30} color={COLORS.muted} spacing={0.3} upper>
          {settings ? 'Настройки' : 'Пауза'}
        </UIText>
        <View style={styles.list}>
          {settings && <VolumeSettings volume={volume} selected={selected} onHover={select} />}
          {entries.map((action, index) => (
            <MenuItem key={action.label}
                      label={action.label}
                      selected={volumeRows.length + index === selected}
                      onHover={() => select(volumeRows.length + index)}
                      onPress={action.onPress}
                      style={styles.item}
            />
          ))}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.pauseOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'auto',
  },
  column: {
    alignItems: 'flex-start',
    gap: 60,
  },
  list: {
    alignItems: 'flex-start',
    gap: 12,
  },
  item: {
    paddingVertical: 20,
  },
})
