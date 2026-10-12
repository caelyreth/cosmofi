import { rgbChannels, type RGBChannels } from '#lib/theme/color'
import type { Family } from '#lib/theme/palette'

import { getContext2d, type SignalViewport } from './canvas'
import { createLighting } from './lighting'
import { drawSamples } from './samples'
import { createTextField } from './text-field'
import { createWaves } from './waves'

export interface SignalState {
  readonly family: Family
  readonly paused: boolean
}

export interface SignalRenderer {
  update(state: SignalState): void
  destroy(): void
}

interface SignalRendererOptions {
  readonly onready?: () => void
}

export function createSignalRenderer(
  canvas: HTMLCanvasElement,
  initial: SignalState,
  { onready }: SignalRendererOptions = {},
): SignalRenderer {
  const context = getContext2d(canvas)

  const compact = window.matchMedia('(max-width: 600px)')
  const text = createTextField(context)
  const waves = createWaves(context)
  const lighting = createLighting(context)

  let family = initial.family
  let paused = initial.paused
  let target: RGBChannels = rgbChannels(family.foreground)
  let color: [number, number, number] = [...target]
  let viewport: SignalViewport = {
    width: 0,
    height: 0,
    dpr: 1,
    compact: compact.matches,
  }
  let ink = ''
  let time = 0
  let previous = 0
  let frame = 0
  let visible = true
  let destroyed = false
  let painted = false

  function draw() {
    if (viewport.width <= 0 || viewport.height <= 0) {
      return
    }

    const nextInk =
      `${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])}`

    if (ink !== nextInk) {
      ink = nextInk
      text.setColor(ink)
      waves.setColor(ink)
      lighting.setColor(ink)
    }

    context.clearRect(0, 0, viewport.width, viewport.height)
    lighting.drawBackground()
    text.draw(time)
    waves.draw(time)
    lighting.drawForeground()

    if (!viewport.compact) {
      drawSamples(context, viewport, time, family, ink)
    }

    if (!painted) {
      painted = true
      onready?.()
    }
  }

  function runnable() {
    return (
      !destroyed &&
      visible &&
      !document.hidden &&
      viewport.width > 0 &&
      viewport.height > 0
    )
  }

  function changing() {
    return (
      !paused ||
      color.some((value, index) => Math.abs(target[index] - value) > 0.5)
    )
  }

  function loop(now: number) {
    frame = 0

    if (!runnable()) {
      return
    }

    const elapsed = Math.min((now - previous) / 1000, 0.1)
    const blend = 1 - Math.exp(-elapsed * 3.5)

    if (!paused) {
      time += elapsed
    }

    previous = now

    for (let index = 0; index < color.length; index += 1) {
      color[index] += (target[index] - color[index]) * blend
    }

    draw()

    if (changing()) {
      frame = requestAnimationFrame(loop)
    }
  }

  function start() {
    if (!frame && runnable() && changing()) {
      previous = performance.now()
      frame = requestAnimationFrame(loop)
    }
  }

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  function updateVisibility() {
    if (runnable()) {
      start()
    } else {
      stop()
    }
  }

  function resize(
    bounds: Pick<DOMRectReadOnly, 'width' | 'height'> =
      canvas.getBoundingClientRect(),
  ) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const { width, height } = bounds

    if (width <= 0 || height <= 0) {
      viewport = { width, height, dpr, compact: compact.matches }
      stop()
      return
    }

    if (
      viewport.width === width &&
      viewport.height === height &&
      viewport.dpr === dpr
    ) {
      return
    }

    viewport = { width, height, dpr, compact: compact.matches }
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    text.resize(viewport)
    waves.resize(viewport)
    lighting.resize(viewport)
    draw()
    start()
  }

  function updateCompact() {
    viewport = { ...viewport, compact: compact.matches }
    waves.resize(viewport)
    draw()
  }

  // Prepare buffers before installing observers so failed initialization leaves no listeners.
  resize()

  const resizeObserver = new ResizeObserver(([entry]) => {
    resize(entry.contentRect)
  })
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    updateVisibility()
  })

  resizeObserver.observe(canvas)
  intersection.observe(canvas)
  compact.addEventListener('change', updateCompact)
  document.addEventListener('visibilitychange', updateVisibility)

  void document.fonts.ready.then(() => {
    if (!destroyed) {
      text.resize(viewport)
      draw()
    }
  })

  return {
    update(state) {
      if (family.id !== state.family.id) {
        family = state.family
        target = rgbChannels(family.foreground)
      }

      paused = state.paused

      if (paused) {
        color = [...target]
        stop()
        draw()
      } else {
        start()
      }
    },
    destroy() {
      destroyed = true
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      compact.removeEventListener('change', updateCompact)
      document.removeEventListener('visibilitychange', updateVisibility)
    },
  }
}
