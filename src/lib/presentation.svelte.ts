import { createContext } from 'svelte'
import { prefersReducedMotion } from 'svelte/motion'

import { families, familyIndex, type FamilyId } from './theme'

export class Presentation {
  #channel = $state(1)
  direction = $state<-1 | 1>(1)
  loopColors = $state(true)

  get channel() {
    return this.#channel
  }

  set channel(next: number) {
    if (next === this.#channel) {
      return
    }

    this.direction = next > this.#channel ? 1 : -1
    this.#channel = next
  }

  get family() {
    return families[this.channel]
  }

  get paused() {
    return prefersReducedMotion.current
  }

  select(id: FamilyId, direction?: -1 | 1) {
    this.channel = familyIndex[id]

    if (direction !== undefined) {
      this.direction = direction
    }
  }
}

export const [getPresentation, setPresentation] =
  createContext<Presentation>()
