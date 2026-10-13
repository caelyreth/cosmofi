export interface SignalViewport {
  readonly width: number
  readonly height: number
  readonly dpr: number
  readonly compact: boolean
}

export interface CanvasLayer {
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D
}

export const focusPosition = 0.72

export function getContext2d(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas unavailable')
  }

  return context
}

export function createLayer(
  width: number,
  height: number,
  dpr: number,
): CanvasLayer {
  const canvas = document.createElement('canvas')
  const context = getContext2d(canvas)

  canvas.width = Math.ceil(width * dpr)
  canvas.height = Math.ceil(height * dpr)
  context.setTransform(dpr, 0, 0, dpr, 0, 0)

  return { canvas, context }
}
