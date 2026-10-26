import { Fragment, useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'
import type { Href } from 'expo-router'
import { FULLSCREEN_ZONE, useFullscreenOffer } from '@/novel/components/FullscreenButton'
import { useLocale } from '@/novel/components/Locale'
import UIText from '@/novel/components/UIText'
import { Lang, langPath, LANGUAGES } from '@/novel/i18n'
import { COLORS, IDLE_OPACITY } from '@/novel/theme'

const ZONE = 110
const GAP = 20
const INSET = 22

type Props = {
  onChange: (lang: Lang) => void
}

export default function LanguageButton ({ onChange }: Props) {
  const { lang, setLang } = useLocale()
  const offer = useFullscreenOffer()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  if (LANGUAGES.length < 2) {
    return null
  }

  const pick = (code: Lang) => {
    if (code === lang) {
      return
    }
    setLang(code)
    onChange(code)
  }

  const right = offer
    ? FULLSCREEN_ZONE.right + FULLSCREEN_ZONE.size + GAP - INSET
    : FULLSCREEN_ZONE.right - INSET

  return (
    <View style={[styles.button, { right }, (hovered || pressed) && styles.active]}>
      <View style={[styles.plate, (hovered || pressed) && styles.platePressed]} />
      {LANGUAGES.map((language, index) => {
        const zone = (
          <Pressable onPress={() => pick(language.code)}
                     onPressIn={() => setPressed(true)}
                     onPressOut={() => setPressed(false)}
                     onHoverIn={() => setHovered(true)}
                     onHoverOut={() => setHovered(false)}
                     accessibilityLabel={language.name}
                     style={styles.zone}
          >
            <UIText size={30} spacing={0.06} color={language.code === lang ? COLORS.cream : COLORS.muted}>
              {language.code.toUpperCase()}
            </UIText>
          </Pressable>
        )
        return (
          <Fragment key={language.code}>
            {index > 0 && <UIText size={30} color={COLORS.muted} style={styles.slash}>/</UIText>}
            {Platform.OS === 'web'
              ? <Link href={langPath(language.code) as Href} replace asChild>{zone}</Link>
              : zone}
          </Fragment>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: FULLSCREEN_ZONE.top - (ZONE - FULLSCREEN_ZONE.size) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: IDLE_OPACITY,
  },
  active: {
    opacity: 1,
  },
  plate: {
    position: 'absolute',
    top: (ZONE - FULLSCREEN_ZONE.size) / 2,
    height: FULLSCREEN_ZONE.size,
    left: INSET,
    right: INSET,
    backgroundColor: COLORS.pauseBtn,
  },
  platePressed: {
    backgroundColor: COLORS.pauseBtnPressed,
  },
  zone: {
    minWidth: ZONE,
    height: ZONE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slash: {
    marginHorizontal: -18,
    pointerEvents: 'none',
  },
})
