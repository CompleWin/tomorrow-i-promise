import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { loadEmailSent, markEmailSent } from '@/novel/storage'
import { EMAIL_PATTERN, submitEmail } from '@/novel/vote'
import UIText from '@/novel/components/UIText'
import { COLORS, FONT } from '@/novel/theme'

const INTRO = 'Пока сыграло слишком мало игроков, чтобы показать, как выбрали другие. ' +
  'Оставьте почту, и мы напишем, когда соберём статистику.'
const THANKS = 'Спасибо! Напишем, как только соберём статистику.'

type Status = 'idle' | 'sending' | 'invalid' | 'failed' | 'sent'

export default function EmailForm () {
  const [sent, setSent] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadEmailSent().then(value => {
      if (!cancelled) {
        setSent(value)
      }
    })
    return () => { cancelled = true }
  }, [])

  async function send () {
    if (status === 'sending') {
      return
    }
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setStatus('invalid')
      return
    }
    setStatus('sending')
    try {
      await submitEmail(value)
      await markEmailSent()
      setStatus('sent')
      setSent(true)
    } catch (error) {
      console.warn('failed to send email', error)
      setStatus('failed')
    }
  }

  if (sent === null) {
    return null
  }

  if (sent) {
    return (
      <View style={styles.form}>
        <UIText size={40} lineHeight={1.35} color={COLORS.cream2} align={'center'}>{THANKS}</UIText>
      </View>
    )
  }

  let note = ' '
  if (status === 'invalid') {
    note = 'Проверьте адрес почты'
  } else if (status === 'failed') {
    note = 'Не получилось отправить, попробуйте ещё раз'
  }

  return (
    <Pressable onPress={() => {}} focusable={false} style={styles.form}>
      <UIText size={34} lineHeight={1.35} color={COLORS.cream2} align={'center'}>{INTRO}</UIText>

      <View style={styles.row}>
        <TextInput value={email}
                   onChangeText={text => {
                     setEmail(text)
                     if (status === 'invalid' || status === 'failed') {
                       setStatus('idle')
                     }
                   }}
                   onSubmitEditing={send}
                   placeholder={'you@example.com'}
                   placeholderTextColor={COLORS.note}
                   inputMode={'email'}
                   autoComplete={'email'}
                   autoCapitalize={'none'}
                   autoCorrect={false}
                   editable={status !== 'sending'}
                   style={styles.input}
        />
        <Pressable onPress={send}
                   onHoverIn={() => setHovered(true)}
                   onHoverOut={() => setHovered(false)}
                   disabled={status === 'sending'}
                   style={styles.button}
        >
          {({ pressed }) => (
            <UIText size={34} color={hovered || pressed ? COLORS.lamp : COLORS.cream2}>
              {status === 'sending' ? 'Отправляем...' : 'Отправить'}
            </UIText>
          )}
        </Pressable>
      </View>

      <UIText size={26} color={COLORS.muted}>{note}</UIText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  form: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    cursor: 'auto',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  },
  input: {
    width: 760,
    height: 76,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: COLORS.cream2,
    backgroundColor: COLORS.pauseBtn,
    color: COLORS.cream,
    fontFamily: FONT,
    fontSize: 32,
    outlineWidth: 0,
  },
  button: {
    height: 76,
    justifyContent: 'center',
  },
})
