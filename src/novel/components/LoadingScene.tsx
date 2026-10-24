import { StyleSheet, View } from 'react-native'
import ContinuePrompt from '@/novel/components/ContinuePrompt'
import LoadingBar from '@/novel/components/LoadingBar'

type Props = {
  progress?: () => number
  ready?: boolean
}

export default function LoadingScene ({ progress, ready = false }: Props) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.root]}>
      {ready ? <ContinuePrompt /> : <LoadingBar progress={progress} />}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
