import { base, familyById, type HexColor } from 'cosmofi-starfield'
import {
  formatHex,
  formatRgb,
  modeLrgb,
  modeOklch,
  modeRgb,
  useMode,
  wcagContrast,
  type Rgb,
} from 'culori/fn'

export const colorFormats = [
  { id: 'hex', label: 'Hex' },
  { id: 'rgb', label: 'RGB' },
  { id: 'oklch', label: 'OKLCH' },
] as const

export type ColorFormat = (typeof colorFormats)[number]['id']

export interface ColorRepresentation {
  readonly copy: string
  readonly display: string
}

type ColorValues = Readonly<Record<ColorFormat, ColorRepresentation>>

const toRgb = useMode(modeRgb)
const toOklch = useMode(modeOklch)
useMode(modeLrgb)

export type RGBChannels = readonly [
  red: number,
  green: number,
  blue: number,
]

function readRgb(color: HexColor): Rgb {
  const rgb = toRgb(color)

  if (!rgb) {
    throw new Error(`Invalid color: ${color}`)
  }

  return rgb
}

function channels(rgb: Rgb): RGBChannels {
  return [
    Math.round(rgb.r * 255),
    Math.round(rgb.g * 255),
    Math.round(rgb.b * 255),
  ]
}

export function rgbChannels(color: HexColor): RGBChannels {
  return channels(readRgb(color))
}

const cache = new Map<HexColor, ColorValues>()
const inkCache = new Map<HexColor, HexColor>()

export function colorHue(hex: HexColor) {
  return toOklch(hex)?.h ?? 0
}

function round(value: number, places: number) {
  const precision = 10 ** places

  return Math.round(value * precision) / precision
}

function convert(hex: HexColor): ColorValues {
  const rgb = readRgb(hex)
  const oklch = toOklch(rgb)
  const hexValue = formatHex(rgb)!.toUpperCase()
  const rgbDisplay = channels(rgb).join(', ')
  const oklchDisplay = `${round(oklch.l * 100, 2)}% ${round(oklch.c, 4)} ${round(oklch.h ?? 0, 2)}`

  return {
    hex: { copy: hexValue, display: hexValue },
    rgb: { copy: formatRgb(rgb)!, display: rgbDisplay },
    oklch: { copy: `oklch(${oklchDisplay})`, display: oklchDisplay },
  }
}

export function colorRepresentation(
  hex: HexColor,
  format: ColorFormat,
): ColorRepresentation {
  let values = cache.get(hex)

  if (!values) {
    values = convert(hex)
    cache.set(hex, values)
  }

  return values[format]
}

export function readableInk(hex: HexColor): HexColor {
  let ink = inkCache.get(hex)

  if (!ink) {
    const dark = base.background
    const light = familyById.moonveil.emphasis
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
