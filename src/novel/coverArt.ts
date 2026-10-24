export const ART_W = 200
export const ART_H = 105

const PALETTE = {
  a: '#5a2a26',
  c: '#69312c',
  d: '#7f3b33',
  e: '#95463a',
  k: '#050403',
  f: '#f9dda8',
} as const

type Tone = keyof typeof PALETTE
type Grid = Tone[][]

export type ArtState = {
  rot: [number, number, number, number]
  cloud: number
  lit: (index: number, base: boolean) => boolean
}

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
const BANDS: [number, Tone][] = [[0, 'a'], [34, 'c'], [58, 'd'], [74, 'e']]
const CLOUDS: [number, number, number, Tone][] = [
  [96, 12, 46, 'c'], [150, 20, 34, 'c'], [8, 44, 40, 'd'], [150, 50, 44, 'd'], [60, 66, 36, 'e'],
]
const HOUSES: [number, number, number, boolean, [number, number, boolean][]][] = [
  [2, 12, 9, true, [[3, 4, true], [7, 4, false]]],
  [15, 8, 13, false, [[2, 3, true], [2, 8, true]]],
  [25, 16, 7, true, [[3, 3, false], [8, 3, true], [12, 3, false]]],
  [43, 10, 11, true, [[4, 4, true]]],
  [56, 7, 16, false, [[2, 3, false], [2, 7, true], [2, 11, false]]],
  [65, 14, 8, true, [[3, 3, true], [9, 3, true]]],
  [82, 9, 10, true, [[3, 4, false]]],
  [93, 18, 6, false, [[3, 2, true], [8, 2, false], [13, 2, true]]],
  [113, 11, 12, true, [[3, 4, false], [6, 4, true]]],
  [178, 12, 8, true, [[4, 3, true]]],
  [192, 9, 12, false, [[3, 3, false], [3, 8, true]]],
]
const POLES = [140, 154, 168]

const ground = (x: number) => 86 + Math.round(2 * Math.sin(x / 17) + 1.5 * Math.sin(x / 7 + 1))

function build (state: ArtState): Grid {
  const g: Grid = Array.from({ length: ART_H }, () => new Array<Tone>(ART_W).fill('a'))
  const set = (x: number, y: number, c: Tone) => {
    const px = Math.round(x)
    const py = Math.round(y)
    if (px >= 0 && px < ART_W && py >= 0 && py < ART_H) {
      g[py][px] = c
    }
  }
  const rect = (x: number, y: number, w: number, h: number, c: Tone) => {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        set(x + i, y + j, c)
      }
    }
  }

  for (let y = 0; y < ART_H; y++) {
    for (let x = 0; x < ART_W; x++) {
      let c = BANDS[0][1]
      for (let b = 1; b < BANDS.length; b++) {
        const edge = BANDS[b][0]
        if (y >= edge + 3) {
          c = BANDS[b][1]
        } else {
          if (y >= edge - 3) {
            const t = (y - (edge - 3)) / 6
            c = BAYER[y % 4][x % 4] / 16 < t ? BANDS[b][1] : BANDS[b - 1][1]
          }
          break
        }
      }
      g[y][x] = c
    }
  }

  for (const [x0, y, w, c] of CLOUDS) {
    const speed = y < 30 ? 1 : y < 55 ? 0.6 : 0.35
    const m = ART_W + w
    const x = Math.round((((x0 + w + state.cloud * speed) % m) + m) % m) - w
    rect(x, y, w, 1, c)
    rect(x + 4, y - 1, w - 12, 1, c)
    rect(x + 9, y + 1, w - 14, 1, c)
  }

  const turbine = (hx: number, hy: number, length: number, c: Tone, angle: number) => {
    const base = ground(hx)
    const big = length > 20
    for (let y = hy + 1; y <= base; y++) {
      const t = (y - hy - 1) / Math.max(1, base - hy - 1)
      const w = big ? (t < 0.35 ? 2 : t < 0.75 ? 3 : 4) : 1
      rect(hx - Math.floor((w - 1) / 2), y, w, 1, c)
    }
    if (big) {
      rect(hx - 2, hy - 1, 6, 3, c)
    } else if (length > 8) {
      rect(hx - 1, hy, 3, 1, c)
    }
    for (const deg of [-78, 42, 162]) {
      const r = (deg + angle) * Math.PI / 180
      const dx = Math.cos(r)
      const dy = Math.sin(r)
      for (let s = 0; s <= length; s += 0.5) {
        set(hx + dx * s, hy + dy * s, c)
        if (big && s > 2 && s < length * 0.6) {
          set(hx + dx * s - dy, hy + dy * s + dx, c)
        }
      }
    }
  }
  turbine(47, 60, 12, 'a', state.rot[0])
  turbine(77, 68, 7, 'a', state.rot[1])
  turbine(181, 58, 13, 'a', state.rot[2])
  turbine(132, 30, 31, 'k', state.rot[3])

  for (const px of POLES) {
    rect(px, ground(px) - 11, 1, 11, 'k')
  }
  for (let i = 0; i < POLES.length - 1; i++) {
    const x0 = POLES[i]
    const x1 = POLES[i + 1]
    const y0 = ground(x0) - 10
    const y1 = ground(x1) - 10
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / (x1 - x0)
      set(x, y0 + (y1 - y0) * t + 3 * Math.sin(Math.PI * t), 'k')
    }
  }

  for (let x = 0; x < ART_W; x++) {
    for (let y = ground(x); y < ART_H; y++) {
      g[y][x] = 'k'
    }
  }

  let index = 0
  for (const [x, w, h, roof, windows] of HOUSES) {
    let base = ART_H
    for (let i = 0; i < w; i++) {
      base = Math.min(base, ground(x + i))
    }
    const top = base - h + 1
    rect(x, top, w, ART_H - top, 'k')
    if (roof) {
      for (let j = 1; j <= Math.ceil(w / 2); j++) {
        rect(x + j - 1, top - j, w - 2 * (j - 1), 1, 'k')
      }
    } else {
      rect(x + w - 3, top - 3, 2, 3, 'k')
    }
    for (const [dx, dy, lit] of windows) {
      if (state.lit(index++, lit)) {
        rect(x + dx, top + dy, 2, 2, 'f')
      }
    }
  }
  return g
}

export function drawArt (ctx: CanvasRenderingContext2D, scale: number, state: ArtState) {
  const g = build(state)
  for (let y = 0; y < ART_H; y++) {
    let x = 0
    while (x < ART_W) {
      const c = g[y][x]
      let n = 1
      while (x + n < ART_W && g[y][x + n] === c) {
        n++
      }
      ctx.fillStyle = PALETTE[c]
      ctx.fillRect(x * scale, y * scale, n * scale, scale)
      x += n
    }
  }
}

export function hash (n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453
  return x - Math.floor(x)
}

export const SKY = PALETTE.a
export const EARTH = PALETTE.k
