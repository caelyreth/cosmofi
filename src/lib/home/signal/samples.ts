import type { Family } from '#lib/theme/palette'

import type { SignalViewport } from './canvas'

export function drawSamples(
  context: CanvasRenderingContext2D,
  viewport: SignalViewport,
  time: number,
  family: Family,
  ink: string,
) {
  const { width, height } = viewport
  const start = width * 0.42
  const end = width * 0.95
  const cells = 56

  for (let index = 0; index < cells; index += 1) {
    const energy =
      0.2 +
      0.8 * Math.abs(
        Math.sin(index * 0.23 + time * 0.6) *
        Math.sin(index * 0.057 - time * 0.3),
      )

    context.fillStyle = `rgba(${ink},${0.12 + energy * 0.3})`
    context.fillRect(
      start + index * (end - start) / cells,
      height * 0.87 - energy * 28,
      Math.max(1, (end - start) / cells - 3),
      energy * 28,
    )
  }

  context.fillStyle = `rgba(${ink},.5)`
  context.font = '12px "Manrope", sans-serif'
  context.textBaseline = 'middle'
  context.fillText(
    `${family.name.toUpperCase()} / SYNTHESIZED CARRIER`,
    start,
    height * 0.93,
  )
}
