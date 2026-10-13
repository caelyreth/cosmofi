import { familyById } from 'cosmofi'

import { rgbChannels } from '#lib/theme/color'

import { focusPosition, type SignalViewport } from './canvas'

const neutralInk = rgbChannels(familyById.moonveil.emphasis).join(',')

interface Lighting {
  readonly glare: CanvasGradient
  readonly beam: CanvasGradient
  readonly lens: CanvasGradient
}

export function createLighting(context: CanvasRenderingContext2D) {
  let viewport: SignalViewport | undefined
  let gradients: Lighting | undefined
  let ink = ''

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

    glare.addColorStop(0, `rgba(${ink},.19)`)
    glare.addColorStop(0.2, `rgba(${ink},.07)`)
    glare.addColorStop(1, `rgba(${ink},0)`)

    const beam = context.createLinearGradient(0, 0, width, 0)

    beam.addColorStop(0, `rgba(${ink},0)`)
    beam.addColorStop(0.5, `rgba(${ink},.04)`)
    beam.addColorStop(focusPosition, `rgba(${neutralInk},.65)`)
    beam.addColorStop(1, `rgba(${ink},0)`)

    const lens = context.createRadialGradient(
      focus,
      center,
      0,
      focus,
      center,
      height * 0.15,
    )

    lens.addColorStop(0, `rgba(${neutralInk},.7)`)
    lens.addColorStop(0.03, `rgba(${ink},.35)`)
    lens.addColorStop(0.12, `rgba(${ink},.08)`)
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
    context.globalCompositeOperation = 'screen'
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

  return { resize, setColor, drawBackground, drawForeground }
}
