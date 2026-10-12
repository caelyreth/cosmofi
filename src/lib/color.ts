import {
  formatHex,
  formatHsl,
  formatRgb,
  modeHsl,
  modeLrgb,
  modeOklch,
  modeRgb,
  useMode,
  wcagContrast,
} from 'culori/fn'

export const colorFormats = [
  { id: 'hex', label: 'Hex' },
  { id: 'rgb', label: 'RGB' },
  { id: 'hsl', label: 'HSL' },
  { id: 'oklch', label: 'OKLCH' },
] as const

export type ColorFormat = (typeof colorFormats)[number]['id']
type ColorValues = Record<ColorFormat, string>

const toRgb = useMode(modeRgb)
const toOklch = useMode(modeOklch)
useMode(modeHsl)
useMode(modeLrgb)

const cache = new Map<string, ColorValues>()
const inkCache = new Map<string, string>()

export function colorHue(hex: string) {
  return toOklch(hex)?.h ?? 0
}

function round(value: number, places: number) {
  const precision = 10 ** places
  return Math.round(value * precision) / precision
}

function convert(hex: string): ColorValues {
  const rgb = toRgb(hex)

  if (!rgb) {
    throw new Error(`Invalid color: ${hex}`)
  }

  const oklch = toOklch(rgb)

  return {
    hex: formatHex(rgb)!.toUpperCase(),
    rgb: formatRgb(rgb)!,
    hsl: formatHsl(rgb)!,
    oklch: `oklch(${round(oklch.l * 100, 2)}% ${round(oklch.c, 4)} ${round(oklch.h ?? 0, 2)})`,
  }
}

export function colorValue(hex: string, format: ColorFormat) {
  let values = cache.get(hex)

  if (!values) {
    values = convert(hex)
    cache.set(hex, values)
  }

  return values[format]
}

export function colorDisplayValue(hex: string, format: ColorFormat) {
  const value = colorValue(hex, format)

  if (format === 'hex') {
    return value
  }

  const opening = value.indexOf('(')
  return opening === -1 ? value : value.slice(opening + 1, -1)
}

export function readableInk(hex: string) {
  let ink = inkCache.get(hex)

  if (!ink) {
    const dark = '#161616'
    const light = '#D9D7CD'
    const darkContrast = wcagContrast(hex, dark)
    const lightContrast = wcagContrast(hex, light)
    ink = darkContrast >= lightContrast ? dark : light

    if (Math.max(darkContrast, lightContrast) < 4.5) {
      ink = wcagContrast(hex, '#000000') >= 4.5 ? '#000000' : '#FFFFFF'
    }

    inkCache.set(hex, ink)
  }

  return ink
}
