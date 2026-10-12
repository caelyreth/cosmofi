import type { Attachment } from 'svelte/attachments'

const navigationKeys = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
])

export const rovingFocus: Attachment<HTMLElement> = (element) => {
  function navigate(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return
    }

    if (!navigationKeys.has(event.key) || !(event.target instanceof HTMLElement)) {
      return
    }

    const target = event.target.closest('button')

    if (!target || !element.contains(target)) {
      return
    }

    const buttons = Array.from(
      element.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
    )
    const current = buttons.indexOf(target)

    if (current === -1) {
      return
    }

    const direction =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1
    let next = (current + direction + buttons.length) % buttons.length

    if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = buttons.length - 1
    }

    event.preventDefault()
    buttons[next].focus()
    buttons[next].click()
  }

  element.addEventListener('keydown', navigate)

  return () => element.removeEventListener('keydown', navigate)
}
