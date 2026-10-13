import { focusPosition, type SignalViewport } from './canvas'

interface WaveBand {
  readonly baseline: number
  readonly opacity: number
  readonly pulseSin: Float32Array
  readonly pulseCos: Float32Array
  readonly harmonicSin: Float32Array
  readonly harmonicCos: Float32Array
  ink: string
}

export function createWaves(context: CanvasRenderingContext2D) {
  let bands: WaveBand[] = []
  let positions = new Float32Array()
  let ink = ''

  function resize(viewport: SignalViewport) {
    const { width, height, compact } = viewport
    const steps = Math.max(64, Math.min(180, Math.ceil(width / 8)))
    const count = compact ? 16 : 22
    const amplitude = height * 0.23
    const center = height * 0.57

    positions = Float32Array.from(
      { length: steps + 1 },
      (_, step) => (step / steps) * width,
    )

    // Spatial coefficients stay fixed; only four phase values change per frame.
    bands = Array.from({ length: count }, (_, index) => {
      const depth = index / (count - 1)
      const opacity = 0.12 + Math.sin(depth * Math.PI) * 0.45
      const band: WaveBand = {
        baseline: center + (depth - 0.5) * height * 0.4,
        opacity,
        ink: `rgba(${ink},${opacity})`,
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
  }

  function setColor(next: string) {
    ink = next

    for (const band of bands) {
      band.ink = `rgba(${ink},${band.opacity})`
    }
  }

  function draw(time: number) {
    const pulseSin = Math.sin(time * 0.35)
    const pulseCos = Math.cos(time * 0.35)
    const harmonicSin = Math.sin(time * 0.18)
    const harmonicCos = Math.cos(time * 0.18)

    context.lineWidth = 1

    for (const band of bands) {
      context.beginPath()

      for (let step = 0; step < positions.length; step += 1) {
        const x = positions[step]
        const y =
          band.baseline +
          band.pulseSin[step] * pulseCos -
          band.pulseCos[step] * pulseSin +
          band.harmonicSin[step] * harmonicCos +
          band.harmonicCos[step] * harmonicSin

        if (step === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.strokeStyle = band.ink
      context.stroke()
    }
  }

  return { resize, setColor, draw }
}
