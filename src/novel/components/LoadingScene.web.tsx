import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import ContinuePrompt from '@/novel/components/ContinuePrompt'
import { useLocale } from '@/novel/components/Locale'
import UIText from '@/novel/components/UIText'
import { ART_H, ART_W, drawArt, EARTH, hash, SKY } from '@/novel/coverArt'
import { loadProgress } from '@/novel/content'
import { COLORS } from '@/novel/theme'

const FRAME_W = 1920
const FRAME_H = 1080
const SCALE = Math.floor(Math.min(FRAME_W / ART_W, FRAME_H / ART_H))
const OFFSET_X = Math.round((FRAME_W - ART_W * SCALE) / 2)
const OFFSET_Y = Math.round((FRAME_H - ART_H * SCALE) / 2)
const FPS = 12
const POLL_MS = 150
const EASE_POWER = 2
const SPEED = [22.5, 37.5, 15, 30]
const FLICKER_FRAMES = 4
const CYCLE_FRAMES = 192
const BLACKOUT_FROM = 120
const SURGE_FRAME = 121
const BLACKOUT_TO = 158

type Props = {
  progress?: () => number
  ready?: boolean
}

export default function LoadingScene ({ progress = loadProgress, ready = false }: Props) {
  const { t } = useLocale()
  const canvas = useRef<HTMLCanvasElement>(null)
  const target = useRef(0)
  const [percent, setPercent] = useState(0)
  const readyAt = useRef<number | null>(-1)
  const poll = useEffectEvent(() => {
    target.current = Math.max(target.current, progress() ** EASE_POWER)
  })

  useEffect(() => {
    poll()
    const timer = setInterval(poll, POLL_MS)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    readyAt.current = ready ? null : -1
  }, [ready])

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) {
      return
    }
    const angles = [0, 0, 0, 0]
    const litAt = new Map<number, number>()
    let shown = 0
    let last = performance.now()
    let lastFrame = -1
    let raf = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      shown += (target.current - shown) * Math.min(1, dt * 4)
      const spin = 1 - (1 - shown) ** 2
      SPEED.forEach((speed, i) => { angles[i] += dt * speed * spin })
      const frame = Math.floor(now / (1000 / FPS))
      if (frame === lastFrame) {
        return
      }
      lastFrame = frame
      setPercent(Math.floor(shown * 100))
      if (readyAt.current === null) {
        readyAt.current = frame
      }
      const cycle = readyAt.current < 0 ? -1 : (frame - readyAt.current) % CYCLE_FRAMES
      const blackout = cycle >= BLACKOUT_FROM && cycle < BLACKOUT_TO
      ctx.fillStyle = SKY
      ctx.fillRect(0, 0, FRAME_W, FRAME_H / 2)
      ctx.fillStyle = EARTH
      ctx.fillRect(0, FRAME_H / 2, FRAME_W, FRAME_H / 2)
      ctx.save()
      ctx.translate(OFFSET_X, OFFSET_Y)
      drawArt(ctx, SCALE, {
        rot: angles.map(a => Math.round(a / 3) * 3) as [number, number, number, number],
        cloud: 6 * Math.sin(now / 1000 * Math.PI / 8),
        lit: (i, base) => {
          if (blackout) {
            return cycle === SURGE_FRAME
          }
          if (!base) {
            return false
          }
          const threshold = 0.04 + hash(i * 7.3 + 1) * 0.9
          if (shown < threshold) {
            return false
          }
          const since = frame - (litAt.get(i) ?? frame)
          if (!litAt.has(i)) {
            litAt.set(i, frame)
          }
          return since >= FLICKER_FRAMES || since % 2 === 0
        },
      })
      ctx.restore()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <View style={StyleSheet.absoluteFill}>
      <canvas ref={canvas} width={FRAME_W} height={FRAME_H} style={styles.canvas} />
      <View style={styles.label}>
        {ready
          ? <ContinuePrompt />
          : <UIText size={30} color={COLORS.muted}>{t.loading(percent)}</UIText>}
      </View>
    </View>
  )
}

const styles = {
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    imageRendering: 'pixelated',
  },
  label: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 64,
    alignItems: 'center',
  },
} as const
