import { familyById } from 'cosmofi'

import { rgbChannels } from '#lib/theme/color'

import {
  createLayer,
  type CanvasLayer,
  type SignalViewport,
} from './canvas'

interface FragmentImage {
  readonly base: CanvasLayer
  readonly accent: CanvasLayer
  readonly image: CanvasLayer
  readonly width: number
  readonly height: number
}

interface Highlight {
  readonly started: number
  readonly hold: number
}

function colorInk(color: Parameters<typeof rgbChannels>[0]) {
  return rgbChannels(color).join(',')
}

const keyword = colorInk(familyById.remnant.foreground)
const typeInk = colorInk(familyById.regolith.foreground)
const stringInk = colorInk(familyById.unripe.foreground)
const neutral = colorInk(familyById.static.foreground)

const fragments = [
  [
    { text: 'const ', ink: keyword },
    { text: 'atmosphere', ink: null },
    { text: " = 'cosmofi';", ink: stringInk },
  ],
  [
    { text: 'signal.', ink: neutral },
    { text: 'receive', ink: null },
    { text: '({ color: palette });', ink: neutral },
  ],
  [
    { text: 'type ', ink: keyword },
    { text: 'Frequency', ink: typeInk },
    { text: " = 'quiet' | 'cosmic';", ink: stringInk },
  ],
  [
    { text: 'return ', ink: keyword },
    { text: '{ background, foreground };', ink: neutral },
  ],
  [
    { text: 'export const ', ink: keyword },
    { text: 'starfield', ink: null },
    { text: ' = { ...colors };', ink: neutral },
  ],
] as const

const attack = 0.24
const release = 0.65

function smoothstep(progress: number) {
  const value = Math.max(0, Math.min(1, progress))

  return value * value * (3 - 2 * value)
}

export function createTextField(context: CanvasRenderingContext2D) {
  let width = 0
  let height = 0
  let columns = 1
  let spacing = 1
  let longest = 0
  let ink = ''
  let images: FragmentImage[] = []
  let fragmentWidths: number[] = []
  let nextHighlight = 0.25

  const highlights = new Map<number, Highlight>()

  function setColor(next: string) {
    ink = next

    for (const fragment of images) {
      const image = fragment.image.context

      image.clearRect(0, 0, fragment.width, fragment.height)
      image.fillStyle = `rgb(${ink})`
      image.fillRect(0, 0, fragment.width, fragment.height)
      image.globalCompositeOperation = 'destination-in'
      image.drawImage(
        fragment.accent.canvas,
        0,
        0,
        fragment.width,
        fragment.height,
      )
      image.globalCompositeOperation = 'source-over'
      image.drawImage(
        fragment.base.canvas,
        0,
        0,
        fragment.width,
        fragment.height,
      )
    }
  }

  function resize(viewport: SignalViewport) {
    width = viewport.width
    height = viewport.height
    columns = width < 900 ? 1 : 2
    context.font = '12px "Martian Mono", monospace'

    const tokenWidths = fragments.map((fragment) =>
      fragment.map((token) => context.measureText(token.text).width),
    )

    fragmentWidths = tokenWidths.map((values) =>
      values.reduce((total, value) => total + value, 0),
    )
    longest = Math.max(...fragmentWidths)
    spacing = Math.max(width / columns, longest + 80)

    // Cached glyphs keep moving lines independent from font rasterization.
    images = fragments.map((fragment, index) => {
      const imageWidth = Math.ceil(fragmentWidths[index] + 2)
      const imageHeight = 24
      const base = createLayer(imageWidth, imageHeight, viewport.dpr)
      const accent = createLayer(imageWidth, imageHeight, viewport.dpr)
      let cursor = 1

      base.context.font = context.font
      accent.context.font = context.font
      base.context.textBaseline = 'middle'
      accent.context.textBaseline = 'middle'

      fragment.forEach((token, tokenIndex) => {
        const layer = token.ink === null ? accent : base

        layer.context.fillStyle =
          token.ink === null ? '#fff' : `rgb(${token.ink})`
        layer.context.fillText(token.text, cursor, imageHeight / 2)
        cursor += tokenWidths[index][tokenIndex]
      })

      return {
        base,
        accent,
        image: createLayer(imageWidth, imageHeight, viewport.dpr),
        width: imageWidth,
        height: imageHeight,
      }
    })

    for (const id of highlights.keys()) {
      if (id >= columns * 4) {
        highlights.delete(id)
      }
    }

    if (ink) {
      setColor(ink)
    }
  }

  function linePosition(id: number, time: number) {
    const row = Math.floor(id / columns)
    const column = id % columns
    const loopWidth = spacing * columns
    const position = column * spacing + row * 61 - time * (18 + row * 3)

    return ((position % loopWidth) + loopWidth) % loopWidth
  }

  function visibleLine(id: number, time: number) {
    const lineWidth = fragmentWidths[id % fragments.length]
    const minimumVisible = Math.min(lineWidth * 0.5, width * 0.4)
    const loopWidth = spacing * columns

    for (
      let x = linePosition(id, time) - loopWidth;
      x < width;
      x += loopWidth
    ) {
      const visibleWidth = Math.min(x + lineWidth, width) - Math.max(x, 0)

      if (visibleWidth >= minimumVisible) {
        return true
      }
    }

    return false
  }

  function updateHighlights(time: number) {
    for (const [id, highlight] of highlights) {
      if (time >= highlight.started + attack + highlight.hold + release) {
        highlights.delete(id)
      }
    }

    if (time < nextHighlight) {
      return
    }

    const candidates = Array.from({ length: columns * 4 }, (_, id) => id)
    const available = candidates.filter(
      (id) => !highlights.has(id) && visibleLine(id, time),
    )
    const id = available[Math.floor(Math.random() * available.length)]

    if (id !== undefined) {
      highlights.set(id, {
        started: time,
        hold: 0.7 + Math.random() * 0.9,
      })
    }

    nextHighlight = time + 0.4 + Math.random() * 0.65
  }

  function glow(id: number, time: number) {
    const highlight = highlights.get(id)

    if (!highlight) {
      return 0
    }

    const elapsed = time - highlight.started
    const rising = smoothstep(elapsed / attack)
    const falling = smoothstep(
      (elapsed - attack - highlight.hold) / release,
    )

    return rising * (1 - falling)
  }

  function draw(time: number) {
    if (images.length === 0) {
      return
    }

    updateHighlights(time)

    const loopWidth = spacing * columns

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const id = row * columns + column
        const fragment = images[id % images.length]
        const y = height * (0.23 + row * 0.145)

        context.globalAlpha = 0.22 + glow(id, time) * 0.72

        for (
          let x = linePosition(id, time) - loopWidth;
          x < width;
          x += loopWidth
        ) {
          if (x > -longest) {
            context.drawImage(
              fragment.image.canvas,
              x - 1,
              y - fragment.height / 2,
              fragment.width,
              fragment.height,
            )
          }
        }
      }
    }

    context.globalAlpha = 1
  }

  return { resize, setColor, draw }
}
