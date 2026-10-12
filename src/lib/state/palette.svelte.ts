import { createContext } from 'svelte'

import type { Direction } from '#lib/motion/direction'
import {
  families,
  familyById,
  familyIndex,
  type FamilyId,
} from '#lib/theme/palette'

export class PaletteSelection {
  #id = $state<FamilyId>('halo')
  #direction = $state<Direction>(1)

  loopColors = $state(true)

  get direction() {
    return this.#direction
  }

  get id() {
    return this.#id
  }

  set id(id: FamilyId) {
    this.select(id)
  }

  get family() {
    return familyById[this.#id]
  }

  get channel() {
    return familyIndex[this.#id]
  }

  set channel(index: number) {
    if (!Number.isInteger(index)) {
      return
    }

    const family = families[index]

    if (family) {
      this.select(family.id)
    }
  }

  select = (id: FamilyId, direction?: Direction) => {
    if (id === this.#id) {
      return
    }

    this.#direction = direction ?? (familyIndex[id] > this.channel ? 1 : -1)
    this.#id = id
  }

  advance = () => {
    const next = families[(this.channel + 1) % families.length]

    this.select(next.id, 1)
  }
}

const [getPaletteSelection, setPaletteSelection] =
  createContext<PaletteSelection>()

export { getPaletteSelection }

export function providePaletteSelection() {
  const selection = new PaletteSelection()

  setPaletteSelection(selection)

  return selection
}
