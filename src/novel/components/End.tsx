import { StyleSheet, View, Text } from 'react-native'
import { Link } from 'expo-router'
import { Choice, getResults, Results } from '@/novel/vote'
import { VoteStatus } from '@/novel/storage'
import { useEffect, useState } from 'react'

const LABELS: Record<Choice, string> = {
  A: 'Оставляем',
  B: 'Не оставляем',
}

type Props = {
  finalChoice: Choice | null
  voteStatus: VoteStatus
}

export default function End ({ finalChoice, voteStatus }: Props) {
  const [results, setResults] = useState<Results | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    getResults().then(r => {
      if (!cancelled) {
        setResults(r)
        setFailed(false)
      }
    }).catch(error => {
      console.warn('failed to get results', error)
      if (!cancelled) {
        setFailed(true)
      }
    })
    return () => {cancelled = true}
  }, [voteStatus])

  let total
  let percentA
  let percentB
  if (results !== null) {
    const { a, b } = results
    total = a + b
    if (total > 0) {
      percentA = Math.round(a * 100 / total)
      percentB = 100 - percentA
    }
  }

  return (
    <View style={styles.end}>

      {finalChoice && (
        <Text style={styles.text}>
          Вы выбрали {LABELS[finalChoice]}
        </Text>
      )}

      {voteStatus === 'pending' ? (
        <Text style={styles.text}>
          Голос будет учтен, когда появится связь
        </Text>
      ) : failed ? (
        <Text style={styles.text}>
          Статистика сейчас недоступна
        </Text>
      ) : results === null ? (
        <Text style={styles.text}>
          Считаем голоса
        </Text>
      ) : total === 0 ? (
        <Text style={styles.text}>
          Пока никто не голосовал
        </Text>
      ) : (
        <>
          <Text style={styles.text}>
            Оставляем — {percentA}%
          </Text>
          <Text style={styles.text}>
            Не оставляем — {percentB}%
          </Text>
        </>
        )
      }
      <Link href="/" style={styles.text}>
        В меню
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  end: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: 12,
  },
})