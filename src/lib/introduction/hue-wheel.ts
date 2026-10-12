import { colorHue } from '#lib/theme/color'
import { families } from '#lib/theme/palette'

const hueFamilies = families
  .filter((family) => family.id !== 'static' && family.id !== 'moonveil')
  .map((family) => ({ ...family, hue: colorHue(family.foreground) }))
  .sort((a, b) => a.hue - b.hue)

export const segments = hueFamilies.map((family, index) => {
  const previousIndex = (index + hueFamilies.length - 1) % hueFamilies.length
  const previous = hueFamilies[previousIndex]
  const next = hueFamilies[(index + 1) % hueFamilies.length]
  const previousHue = previous.hue - (index === 0 ? 360 : 0)
  const nextHue = next.hue + (index === hueFamilies.length - 1 ? 360 : 0)
  let start = (previousHue + family.hue) / 2
  let end = (family.hue + nextHue) / 2

  if (start > 190 && start < 275) {
    start = 275
  }

  if (end > 190 && end < 275) {
    end = 190
  }

  return {
    ...family,
    start: start + 1,
    length: end - start - 2,
    hitArea: sector(start, end),
  }
})

export function point(angle: number, radius: number) {
  const radians = (angle - 90) * Math.PI / 180

  return {
    x: 170 + Math.cos(radians) * radius,
    y: 170 + Math.sin(radians) * radius,
  }
}

function sector(start: number, end: number) {
  const steps = Math.ceil((end - start) / 6)
  const angles = Array.from(
    { length: steps + 1 },
    (_, index) => start + (end - start) * index / steps,
  )
  const points = [
    ...angles.map((angle) => point(angle, 151)),
    ...angles.toReversed().map((angle) => point(angle, 99)),
  ]
  const coordinates = points.map(
    ({ x, y }) => `${x / 340 * 100}% ${y / 340 * 100}%`,
  )

  return `polygon(${coordinates.join(', ')})`
}

const omittedStart = point(190, 125)
const omittedEnd = point(275, 125)
export const omittedArc = `M ${omittedStart.x} ${omittedStart.y} A 125 125 0 0 1 ${omittedEnd.x} ${omittedEnd.y}`
