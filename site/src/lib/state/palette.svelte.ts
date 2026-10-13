import { type FamilyId } from 'cosmofi'
import { createContext } from 'svelte'

import type { Direction } from '#lib/motion/direction'

import type { ThemeSelection } from './theme.svelte'

export class PaletteSelection {
  #theme: ThemeSelection
  #id = $state<FamilyId>('halo')
  #direction = $state<Direction>(1)

  constructor(theme: ThemeSelection) {
    this.#theme = theme
  }

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
    return this.#theme.theme.familyById[this.#id]
  }

  get channel() {
    return this.#theme.theme.familyIndex[this.#id]
  }

  set channel(index: number) {
    if (!Number.isInteger(index)) {
      return
    }

    const family = this.#theme.theme.families[index]

    if (family) {
      this.select(family.id)
    }
  }

  select = (id: FamilyId, direction?: Direction) => {
    if (id === this.#id) {
      return
    }

    const index = this.#theme.theme.familyIndex

    this.#direction = direction ?? (index[id] > this.channel ? 1 : -1)
    this.#id = id
  }

  advance = () => {
    const list = this.#theme.theme.families
    const next = list[(this.channel + 1) % list.length]

    this.select(next.id, 1)
  }
}

const [getPaletteSelection, setPaletteSelection] =
  createContext<PaletteSelection>()

export { getPaletteSelection }

export function providePaletteSelection(theme: ThemeSelection) {
  const selection = new PaletteSelection(theme)

  setPaletteSelection(selection)

  return selection
}
