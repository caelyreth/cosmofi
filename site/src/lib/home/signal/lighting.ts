import type { Scheme } from 'cosmofi'

import { focusPosition, type SignalViewport } from './canvas'

function glowStops(light: boolean) {
  if (light) {
    return {
      glarePeak: '.1',
      glareMid: '.04',
      beamPeak: '.07',
      corePeak: '.22',
      lensPeak: '.16',
      coreCenter: '.45',
      lensFade: '.05',
    }
  }

  return {
    glarePeak: '.19',
    glareMid: '.07',
    beamPeak: '.04',
    corePeak: '.65',
    lensPeak: '.35',
    coreCenter: '.7',
    lensFade: '.08',
  }
}

interface Lighting {
  readonly glare: CanvasGradient
  readonly beam: CanvasGradient
  readonly lens: CanvasGradient
}

export function createLighting(context: CanvasRenderingContext2D) {
  let viewport: SignalViewport | undefined
  let gradients: Lighting | undefined
  let ink = ''
  let neutralInk = ''
  let scheme: Scheme = 'dark'

  function setColor(next: string) {
    ink = next

    if (!viewport) {
      return
    }

    const { width, height } = viewport
    const focus = width * focusPosition
    const center = height * 0.57
    const glare = context.createRadialGradient(
      focus,
      center,
      0,
      focus,
      center,
      height * 0.47,
    )

    const stops = glowStops(scheme === 'light')
    const core = scheme === 'light' ? ink : neutralInk

    glare.addColorStop(0, `rgba(${ink},${stops.glarePeak})`)
    glare.addColorStop(0.2, `rgba(${ink},${stops.glareMid})`)
    glare.addColorStop(1, `rgba(${ink},0)`)

    const beam = context.createLinearGradient(0, 0, width, 0)

    beam.addColorStop(0, `rgba(${ink},0)`)
    beam.addColorStop(0.5, `rgba(${ink},${stops.beamPeak})`)
    beam.addColorStop(focusPosition, `rgba(${core},${stops.corePeak})`)
    beam.addColorStop(1, `rgba(${ink},0)`)

    const lens = context.createRadialGradient(
      focus,
      center,
      0,
      focus,
      center,
      height * 0.15,
    )

    lens.addColorStop(0, `rgba(${core},${stops.coreCenter})`)
    lens.addColorStop(0.03, `rgba(${ink},${stops.lensPeak})`)
    lens.addColorStop(0.12, `rgba(${ink},${stops.lensFade})`)
    lens.addColorStop(1, `rgba(${ink},0)`)

    gradients = { glare, beam, lens }
  }

  function resize(next: SignalViewport) {
    viewport = next

    if (ink) {
      setColor(ink)
    }
  }

  function drawBackground() {
    if (!viewport || !gradients) {
      return
    }

    context.fillStyle = gradients.glare
    context.fillRect(0, 0, viewport.width, viewport.height)
  }

  function drawForeground() {
    if (!viewport || !gradients) {
      return
    }

    const { width, height } = viewport
    const focus = width * focusPosition
    const center = height * 0.57

    context.save()
    context.globalCompositeOperation =
      scheme === 'light' ? 'multiply' : 'screen'
    context.fillStyle = gradients.beam
    context.fillRect(0, center - 0.5, width, 1)
    context.fillStyle = gradients.lens
    context.fillRect(
      focus - height * 0.15,
      center - height * 0.15,
      height * 0.3,
      height * 0.3,
    )
    context.restore()
  }

  function configure(nextScheme: Scheme, glow: string) {
    scheme = nextScheme
    neutralInk = glow

    if (ink) {
      setColor(ink)
    }
  }

  return { resize, setColor, configure, drawBackground, drawForeground }
}
