import { families, type Family } from './theme'

interface CanvasLayer {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

interface FragmentImage {
  base: CanvasLayer
  accent: CanvasLayer
  image: CanvasLayer
  width: number
  height: number
}

interface WaveBand {
  baseline: number
  opacity: number
  ink: string
  pulseSin: Float32Array
  pulseCos: Float32Array
  harmonicSin: Float32Array
  harmonicCos: Float32Array
}

export function createSignalField(
  canvas: HTMLCanvasElement,
  initial: Family,
) {
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas unavailable')
  }

  const ctx = context
  const compact = window.matchMedia('(max-width: 600px)')
  const rgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  let target = rgb(initial.foreground)
  let color = [...target]
  let family = initial
  let width = 0
  let height = 0
  let dpr = 1
  let time = 0
  let previous = 0
  let frame = 0
  let longest = 0
  let spacing = 1
  let columns = 1
  let paused = false
  let visible = true
  let destroyed = false
  let fragmentImages: FragmentImage[] = []
  let waveBands: WaveBand[] = []
  let wavePositions = new Float32Array()
  let renderedColor = ''
  let lighting:
    | { glare: CanvasGradient; beam: CanvasGradient; lens: CanvasGradient }
    | undefined

  const keyword = families[3].foreground
  const typeInk = families[6].foreground
  const stringInk = families[4].foreground
  const neutral = families[0].foreground
  const fragments = [
    [
      { text: 'const ', color: keyword },
      { text: 'atmosphere', color: 'accent' },
      { text: " = 'cosmofi';", color: stringInk },
    ],
    [
      { text: 'signal.', color: neutral },
      { text: 'receive', color: 'accent' },
      { text: '({ color: palette });', color: neutral },
    ],
    [
      { text: 'type ', color: keyword },
      { text: 'Frequency', color: typeInk },
      { text: " = 'quiet' | 'cosmic';", color: stringInk },
    ],
    [
      { text: 'return ', color: keyword },
      { text: '{ background, foreground };', color: neutral },
    ],
    [
      { text: 'export const ', color: keyword },
      { text: 'starfield', color: 'accent' },
      { text: ' = { ...colors };', color: neutral },
    ],
  ].map((fragment) =>
    fragment.map((segment) => ({
      text: segment.text,
      ink: segment.color === 'accent' ? null : rgb(segment.color).join(','),
    })),
  )
  let fragmentTokenWidths: number[][] = []
  let fragmentWidths: number[] = []
  const highlights = new Map<number, { started: number; hold: number }>()
  const focusPosition = 0.72
  const highlightAttack = 0.24
  const highlightRelease = 0.65
  let nextHighlight = 0.25

  function draw() {
    if (width <= 0 || height <= 0 || fragmentImages.length === 0) {
      return
    }

    ctx.clearRect(0, 0, width, height)
    const c = `${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])}`
    const focus = width * focusPosition
    const center = height * 0.57
    const gradients = prepareAppearance(c, focus, center)

    ctx.fillStyle = gradients.glare
    ctx.fillRect(0, 0, width, height)
    drawWords()
    drawWaves()
    drawLens(focus, center, gradients)

    if (!compact.matches) {
      drawSamples(c)
    }
  }

  function prepareAppearance(c: string, focus: number, center: number) {
    if (c === renderedColor && lighting) {
      return lighting
    }

    renderedColor = c
    tintWords(c)

    for (const band of waveBands) {
      band.ink = `rgba(${c},${band.opacity})`
    }

    const glare = ctx.createRadialGradient(
      focus,
      center,
      0,
      focus,
      center,
      height * 0.47,
    )
    glare.addColorStop(0, `rgba(${c},.19)`)
    glare.addColorStop(0.2, `rgba(${c},.07)`)
    glare.addColorStop(1, `rgba(${c},0)`)

    const beam = ctx.createLinearGradient(0, 0, width, 0)
    beam.addColorStop(0, `rgba(${c},0)`)
    beam.addColorStop(0.5, `rgba(${c},.04)`)
    beam.addColorStop(focusPosition, 'rgba(217,215,205,.65)')
    beam.addColorStop(1, `rgba(${c},0)`)

    const lens = ctx.createRadialGradient(
      focus,
      center,
      0,
      focus,
      center,
      height * 0.15,
    )
    lens.addColorStop(0, 'rgba(217,215,205,.7)')
    lens.addColorStop(0.03, `rgba(${c},.35)`)
    lens.addColorStop(0.12, `rgba(${c},.08)`)
    lens.addColorStop(1, `rgba(${c},0)`)

    lighting = { glare, beam, lens }

    return lighting
  }

  function measureWaves() {
    const steps = Math.max(64, Math.min(180, Math.ceil(width / 8)))
    const count = compact.matches ? 16 : 22
    const amplitude = height * 0.23
    const center = height * 0.57

    wavePositions = Float32Array.from(
      { length: steps + 1 },
      (_, step) => step / steps * width,
    )

    // Cache spatial terms; only the four time-dependent phases change per frame.
    waveBands = Array.from({ length: count }, (_, index) => {
      const depth = index / (count - 1)
      const band: WaveBand = {
        baseline: center + (depth - 0.5) * height * 0.4,
        opacity: 0.12 + Math.sin(depth * Math.PI) * 0.45,
        ink: '',
        pulseSin: new Float32Array(steps + 1),
        pulseCos: new Float32Array(steps + 1),
        harmonicSin: new Float32Array(steps + 1),
        harmonicCos: new Float32Array(steps + 1),
      }

      for (let step = 0; step <= steps; step += 1) {
        const u = step / steps
        const envelope = Math.exp(-((u - focusPosition) ** 2) / 0.064)
        const strength = amplitude * envelope * (0.5 + depth * 0.5)
        const pulse = u * 9 + depth * 3.8
        const harmonic = u * 18 + depth * 2.1

        band.pulseSin[step] = Math.sin(pulse) * strength
        band.pulseCos[step] = Math.cos(pulse) * strength
        band.harmonicSin[step] = Math.sin(harmonic) * strength * 0.1
        band.harmonicCos[step] = Math.cos(harmonic) * strength * 0.1
      }

      return band
    })

    renderedColor = ''
  }

  function drawWaves() {
    const pulseSin = Math.sin(time * 0.35)
    const pulseCos = Math.cos(time * 0.35)
    const harmonicSin = Math.sin(time * 0.18)
    const harmonicCos = Math.cos(time * 0.18)

    ctx.lineWidth = 1

    for (const band of waveBands) {
      ctx.beginPath()

      for (let step = 0; step < wavePositions.length; step += 1) {
        const x = wavePositions[step]
        const y =
          band.baseline +
          band.pulseSin[step] * pulseCos -
          band.pulseCos[step] * pulseSin +
          band.harmonicSin[step] * harmonicCos +
          band.harmonicCos[step] * harmonicSin

        if (step === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = band.ink
      ctx.stroke()
    }
  }

  function drawLens(
    focus: number,
    center: number,
    gradients: ReturnType<typeof prepareAppearance>,
  ) {
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = gradients.beam
    ctx.fillRect(0, center - 0.5, width, 1)
    ctx.fillStyle = gradients.lens
    ctx.fillRect(
      focus - height * 0.15,
      center - height * 0.15,
      height * 0.3,
      height * 0.3,
    )
    ctx.restore()
  }

  function drawFragment(
    id: number,
    x: number,
    y: number,
    glow: number,
  ) {
    const fragment = fragmentImages[id % fragmentImages.length]

    ctx.globalAlpha = 0.22 + glow * 0.72
    ctx.drawImage(
      fragment.image.canvas,
      x - 1,
      y - fragment.height / 2,
      fragment.width,
      fragment.height,
    )
    ctx.globalAlpha = 1
  }

  function linePosition(id: number) {
    const row = Math.floor(id / columns)
    const col = id % columns
    const loopWidth = spacing * columns

    return (
      (((col * spacing + row * 61 - time * (18 + row * 3)) % loopWidth) +
        loopWidth) %
      loopWidth
    )
  }

  function visibleLine(id: number) {
    const lineWidth = fragmentWidths[id % fragments.length]
    const minimumVisible = Math.min(lineWidth * 0.5, width * 0.4)
    const loopWidth = spacing * columns

    for (let x = linePosition(id) - loopWidth; x < width; x += loopWidth) {
      const visibleWidth = Math.min(x + lineWidth, width) - Math.max(x, 0)

      if (visibleWidth >= minimumVisible) {
        return true
      }
    }

    return false
  }

  function chooseLine() {
    const candidates = Array.from({ length: columns * 4 }, (_, id) => id)
    const available = candidates.filter(
      (id) => !highlights.has(id) && visibleLine(id),
    )

    return available[Math.floor(Math.random() * available.length)]
  }

  function smoothstep(progress: number) {
    const t = Math.max(0, Math.min(1, progress))

    return t * t * (3 - 2 * t)
  }

  function updateHighlights() {
    for (const [id, highlight] of highlights) {
      const end =
        highlight.started +
        highlightAttack +
        highlight.hold +
        highlightRelease

      if (time >= end) {
        highlights.delete(id)
      }
    }

    if (time >= nextHighlight) {
      const id = chooseLine()

      if (id !== undefined) {
        highlights.set(id, {
          started: time,
          hold: 0.7 + Math.random() * 0.9,
        })
      }

      nextHighlight = time + 0.4 + Math.random() * 0.65
    }
  }

  function lineGlow(id: number) {
    const highlight = highlights.get(id)

    if (!highlight) {
      return 0
    }

    const elapsed = time - highlight.started
    const attack = smoothstep(elapsed / highlightAttack)
    const release = smoothstep(
      (elapsed - highlightAttack - highlight.hold) / highlightRelease,
    )

    return attack * (1 - release)
  }

  function drawWords() {
    updateHighlights()

    for (let row = 0; row < 4; row += 1) {
      drawRow(row)
    }
  }

  function drawRow(row: number) {
    const loopWidth = spacing * columns

    for (let col = 0; col < columns; col += 1) {
      const id = row * columns + col
      const y = height * (0.23 + row * 0.145)
      const glow = lineGlow(id)

      // Repeated copies share a measured pitch, so the seam cannot accumulate overlap.
      for (let x = linePosition(id) - loopWidth; x < width; x += loopWidth) {
        if (x > -longest) {
          drawFragment(id, x, y, glow)
        }
      }
    }
  }

  function measureWords() {
    ctx.font = '12px "Martian Mono", monospace'
    columns = width < 900 ? 1 : 2
    fragmentTokenWidths = fragments.map((fragment) =>
      fragment.map((token) => ctx.measureText(token.text).width),
    )
    fragmentWidths = fragmentTokenWidths.map((widths) =>
      widths.reduce((total, value) => total + value, 0),
    )
    longest = Math.max(...fragmentWidths)
    spacing = Math.max(width / columns, longest + 80)

    // Render glyphs once, then animate whole lines with position and opacity.
    fragmentImages = fragments.map((fragment, index) => {
      const imageWidth = Math.ceil(fragmentWidths[index] + 2)
      const imageHeight = 24
      const base = createLayer(imageWidth, imageHeight)
      const accent = createLayer(imageWidth, imageHeight)
      let cursor = 1

      base.context.font = ctx.font
      accent.context.font = ctx.font
      base.context.textBaseline = 'middle'
      accent.context.textBaseline = 'middle'

      fragment.forEach((token, tokenIndex) => {
        const layer = token.ink === null ? accent : base

        layer.context.fillStyle =
          token.ink === null ? '#fff' : `rgb(${token.ink})`
        layer.context.fillText(token.text, cursor, imageHeight / 2)
        cursor += fragmentTokenWidths[index][tokenIndex]
      })

      return {
        base,
        accent,
        image: createLayer(imageWidth, imageHeight),
        width: imageWidth,
        height: imageHeight,
      }
    })

    for (const id of highlights.keys()) {
      if (id >= columns * 4) {
        highlights.delete(id)
      }
    }

    renderedColor = ''
  }

  function createLayer(layerWidth: number, layerHeight: number): CanvasLayer {
    const layer = document.createElement('canvas')
    const layerContext = layer.getContext('2d')

    if (!layerContext) {
      throw new Error('Canvas unavailable')
    }

    layer.width = Math.ceil(layerWidth * dpr)
    layer.height = Math.ceil(layerHeight * dpr)
    layerContext.setTransform(dpr, 0, 0, dpr, 0, 0)

    return { canvas: layer, context: layerContext }
  }

  function tintWords(c: string) {
    for (const fragment of fragmentImages) {
      const image = fragment.image.context

      image.clearRect(0, 0, fragment.width, fragment.height)
      image.fillStyle = `rgb(${c})`
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

  function drawSamples(c: string) {
    // Sample cells turn the lower edge into a compact spectrum instrument.
    const start = width * 0.42
    const end = width * 0.95
    const cells = 56
    for (let i = 0; i < cells; i += 1) {
      const energy =
        0.2 +
        0.8 *
          Math.abs(
            Math.sin(i * 0.23 + time * 0.6) *
              Math.sin(i * 0.057 - time * 0.3),
          )
      ctx.fillStyle = `rgba(${c},${0.12 + energy * 0.3})`
      ctx.fillRect(
        start + (i * (end - start)) / cells,
        height * 0.87 - energy * 28,
        Math.max(1, (end - start) / cells - 3),
        energy * 28,
      )
    }
    ctx.fillStyle = `rgba(${c},.5)`
    ctx.font = '12px "Manrope", sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      `${family.name.toUpperCase()} / SYNTHESIZED CARRIER`,
      start,
      height * 0.93,
    )
  }

  function runnable() {
    return (
      !destroyed &&
      visible &&
      !document.hidden &&
      width > 0 &&
      height > 0
    )
  }

  function changing() {
    return (
      !paused || color.some((value, i) => Math.abs(target[i] - value) > 0.5)
    )
  }

  function advance(now: number) {
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
  }

  function loop(now: number) {
    frame = 0

    if (!runnable()) {
      return
    }

    advance(now)

    if (changing()) {
      frame = requestAnimationFrame(loop)
    }
  }

  function start() {
    if (!frame && runnable()) {
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

  function updateViewport() {
    measureWaves()
    draw()
  }

  function resize() {
    const { width: nextWidth, height: nextHeight } =
      canvas.getBoundingClientRect()
    const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5)

    if (nextWidth <= 0 || nextHeight <= 0) {
      return
    }

    if (width === nextWidth && height === nextHeight && dpr === nextDpr) {
      return
    }

    width = nextWidth
    height = nextHeight
    dpr = nextDpr
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    measureWords()
    measureWaves()
    draw()
    start()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting
    updateVisibility()
  })
  intersection.observe(canvas)
  compact.addEventListener('change', updateViewport)
  document.addEventListener('visibilitychange', updateVisibility)
  resize()
  void document.fonts.ready.then(() => {
    if (!destroyed) {
      measureWords()
      draw()
    }
  })

  return {
    update(next: Family, nextPaused: boolean) {
      const changed = family.id !== next.id

      family = next

      if (changed) {
        target = rgb(next.foreground)
      }
      paused = nextPaused

      if (paused) {
        color = [...target]
        draw()
      }

      start()
    },
    destroy() {
      destroyed = true
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      compact.removeEventListener('change', updateViewport)
      document.removeEventListener('visibilitychange', updateVisibility)
    },
  }
}
