import { browser } from '$app/env'
import { themes, type ThemeId } from 'cosmofi'
import { createContext } from 'svelte'

export class ThemeSelection {
  id = $state<ThemeId>('starfield')

  constructor(id: ThemeId) {
    this.id = id
  }

  get theme() {
    return themes[this.id]
  }

  get scheme() {
    return this.theme.scheme
  }

  select = (id: ThemeId) => {
    if (id !== this.id) {
      this.#commit(id)
    }
  }

  #commit(id: ThemeId) {
    this.id = id
    persistTheme(id)
  }
}

const [getThemeSelection, setThemeSelection] =
  createContext<ThemeSelection>()

export { getThemeSelection }

export function provideTheme(id: ThemeId) {
  const selection = new ThemeSelection(id)

  setThemeSelection(selection)

  return selection
}

function persistTheme(id: ThemeId) {
  if (!browser) {
    return
  }

  document.cookie = `cosmofi-theme=${id}; Path=/; Max-Age=31536000; SameSite=Lax`
}
