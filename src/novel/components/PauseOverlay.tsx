import { Pressable, StyleSheet, View } from 'react-native'
import MenuItem from '@/novel/components/MenuItem'
import UIText from '@/novel/components/UIText'
import { COLORS } from '@/novel/theme'

type Props = {
  onResume: () => void
  onMenu: () => void
}

export default function PauseOverlay ({ onResume, onMenu }: Props) {
  return (
    <Pressable onPress={onResume} style={styles.overlay}>
      <View style={styles.column}>
        <UIText size={30} color={COLORS.muted} spacing={0.3} upper style={styles.title}>Пауза</UIText>
        <View style={styles.list}>
          <MenuItem label={'Продолжить'} active onPress={onResume} style={styles.item} />
          <MenuItem label={'В меню'} onPress={onMenu} style={styles.item} />
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
  title: {
    paddingLeft: 36,
  },
  list: {
    alignItems: 'flex-start',
    gap: 12,
  },
  item: {
    paddingVertical: 20,
  },
})
