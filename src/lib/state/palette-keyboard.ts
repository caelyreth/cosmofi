import type { PaletteSelection } from './palette.svelte'

const editingSelector =
  'input, textarea, select, button, [contenteditable]:not([contenteditable="false"])'

export function paletteKeyboard(selection: PaletteSelection) {
  return (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey
    ) {
      return
    }

    if (event.target instanceof Element && event.target.closest(editingSelector)) {
      return
    }

    if (/^[1-8]$/.test(event.key)) {
      selection.channel = Number(event.key) - 1
    }
  }
}
