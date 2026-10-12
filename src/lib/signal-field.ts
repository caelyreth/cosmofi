import { families, type Family } from './theme'

export function createSignalField(
  canvas: HTMLCanvasElement,
  initial: Family,
) {
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas unavailable')
  }

  const ctx = context
  const rgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  let target = rgb(initial.foreground)
  let color = [...target]
  let family = initial
  let width = 1
  let height = 1
  let time = 0
  let previous = 0
  let frame = 0
  let longest = 0
  let spacing = 1
  let columns = 1
  let paused = false
  let visible = true
  let destroyed = false

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
    ctx.clearRect(0, 0, width, height)
    const c = color.map(Math.round).join(',')
    const focus = width * focusPosition
    const center = height * 0.57
    // Interference field: every contour is a sampled superposition, never a picture outline.
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
    ctx.fillStyle = glare
    ctx.fillRect(0, 0, width, height)
    drawWords(c)
    drawWaves(c, center)
    drawLens(c, focus, center)
    drawSamples(c)
  }

  function drawWaves(c: string, center: number) {
    const amplitude = height * 0.23
    ctx.lineWidth = 1
    for (let band = 0; band < 22; band += 1) {
      const depth = band / 21
      ctx.beginPath()
      for (let step = 0; step <= 150; step += 1) {
        const x = (step / 150) * width
        const u = x / width
        const envelope = Math.exp(-((u - focusPosition) ** 2) / 0.064)
        const pulse = Math.sin(u * 9 - time * 0.35 + depth * 3.8)
        const harmonic = Math.sin(u * 18 + time * 0.18 + depth * 2.1) * 0.1
        const y =
          center +
          (depth - 0.5) * height * 0.4 +
          (pulse + harmonic) * amplitude * envelope * (0.5 + depth * 0.5)
        if (step === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = `rgba(${c},${0.12 + Math.sin(depth * Math.PI) * 0.45})`
      ctx.stroke()
    }
  }

  function drawLens(c: string, focus: number, center: number) {
    // A lens caustic intersects the carrier, rather than depicting a celestial object.
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    const beam = ctx.createLinearGradient(0, 0, width, 0)
    beam.addColorStop(0, `rgba(${c},0)`)
    beam.addColorStop(0.5, `rgba(${c},.04)`)
    beam.addColorStop(focusPosition, 'rgba(217,215,205,.65)')
    beam.addColorStop(1, `rgba(${c},0)`)
    ctx.fillStyle = beam
    ctx.fillRect(0, center - 0.5, width, 1)
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
    ctx.fillStyle = lens
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
    accent: string,
  ) {
    const fragmentIndex = id % fragments.length
    const fragment = fragments[fragmentIndex]
    const widths = fragmentTokenWidths[fragmentIndex]
    const opacity = 0.22 + glow * 0.72
    let cursor = x
    fragment.forEach((token, tokenIndex) => {
      ctx.fillStyle = `rgba(${token.ink ?? accent},${opacity})`
      ctx.fillText(token.text, cursor, y)
      cursor += widths[tokenIndex]
    })
  }

  function fragmentCopies(id: number) {
    const row = Math.floor(id / columns)
    const col = id % columns
    const loopWidth = spacing * columns
    const x =
      (((col * spacing + row * 61 - time * (18 + row * 3)) % loopWidth) +
        loopWidth) %
      loopWidth

    return [x - loopWidth, x, x + loopWidth].filter(
      (copy) => copy > -longest && copy < width,
    )
  }

  function visibleLine(id: number) {
    const lineWidth = fragmentWidths[id % fragments.length]
    const minimumVisible = Math.min(lineWidth * 0.5, width * 0.4)

    return fragmentCopies(id).some((x) => {
      const visibleWidth = Math.min(x + lineWidth, width) - Math.max(x, 0)

      return visibleWidth >= minimumVisible
    })
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

  function drawWords(c: string) {
    ctx.font = '11px "Martian Mono", monospace'
    ctx.textBaseline = 'middle'
    updateHighlights()
    for (let row = 0; row < 4; row += 1) {
      drawRow(row, c)
    }
  }

  function drawRow(row: number, c: string) {
    for (let col = 0; col < columns; col += 1) {
      const id = row * columns + col
      const y = height * (0.23 + row * 0.145)
      const glow = lineGlow(id)
      // Repeated copies share a measured pitch, so the seam cannot accumulate overlap.
      for (const copy of fragmentCopies(id)) {
        drawFragment(id, copy, y, glow, c)
      }
    }
  }

  function measureWords() {
    ctx.font = '11px "Martian Mono", monospace'
    columns = width < 900 ? 1 : 2
    fragmentTokenWidths = fragments.map((fragment) =>
      fragment.map((token) => ctx.measureText(token.text).width),
    )
    fragmentWidths = fragmentTokenWidths.map((widths) =>
      widths.reduce((total, value) => total + value, 0),
    )
    longest = Math.max(...fragmentWidths)
    spacing = Math.max(width / columns, longest + 80)
  }

  function drawSamples(c: string) {
    // Sample cells turn the lower edge into a compact spectrum instrument.
    const start = width * 0.42
    const end = width * 0.95
    const cells = width < 600 ? 32 : 56
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
    ctx.font = '8px "Martian Mono", monospace'
    ctx.fillText(
      `${family.name.toUpperCase()} / SYNTHESIZED CARRIER`,
      start,
      height * 0.93,
    )
  }

  function runnable() {
    return !destroyed && visible && !document.hidden
  }

  function changing() {
    return (
      !paused || color.some((value, i) => Math.abs(target[i] - value) > 0.5)
    )
  }

  function advance(now: number) {
    if (!paused) {
      time += Math.min((now - previous) / 1000, 0.06)
    }

    previous = now
    color = color.map((value, i) => value + (target[i] - value) * 0.13)
    draw()
  }

  function loop(now: number) {
    frame = 0
    if (!runnable()) {
      return
    }

    if (now - previous >= 40) {
      advance(now)
    }

    if (changing()) {
      frame = requestAnimationFrame(loop)
    }
  }

  function start() {
    if (!frame && runnable()) {
      frame = requestAnimationFrame(loop)
    }
  }

  function resize() {
    const { width: nextWidth, height: nextHeight } =
      canvas.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio, 1.5)
    width = nextWidth
    height = nextHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    measureWords()
    draw()
    start()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting
    if (visible) {
      start()
    }
  })
  intersection.observe(canvas)
  document.addEventListener('visibilitychange', start)
  resize()
  void document.fonts.ready.then(() => {
    if (!destroyed) {
      measureWords()
      draw()
    }
  })

  return {
    update(next: Family, stop: boolean) {
      const changed = family.id !== next.id
      family = next
      if (changed) {
        target = rgb(next.foreground)
      }
      paused = stop
      start()
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', start)
    },
  }
}
