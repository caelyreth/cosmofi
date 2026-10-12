import type { Attachment } from 'svelte/attachments'
import { prefersReducedMotion } from 'svelte/motion'

interface AutoCycleOptions<Value> {
  readonly interval: number
  readonly value: () => Value
  readonly advance: (value: Value) => void
  readonly enabled?: () => boolean
}

export function autoCycle<Value>(
  options: AutoCycleOptions<Value>,
): Attachment<HTMLElement> {
  return (element) => {
    let visible = $state(false)
    let active = $state(!document.hidden)
    let hovered = $state(false)
    let focused = $state(element.contains(document.activeElement))

    function updateVisibility() {
      active = !document.hidden
    }

    function enter() {
      hovered = true
    }

    function leave() {
      hovered = false
    }

    function focus() {
      focused = true
    }

    function blur(event: FocusEvent) {
      focused =
        event.relatedTarget instanceof Node &&
        element.contains(event.relatedTarget)
    }

    $effect(() => {
      const value = options.value()
      const enabled = options.enabled?.() ?? true

      if (
        !enabled ||
        !visible ||
        !active ||
        hovered ||
        focused ||
        prefersReducedMotion.current
      ) {
        return
      }

      const timer = setTimeout(() => options.advance(value), options.interval)

      return () => clearTimeout(timer)
    })

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })

    observer.observe(element)
    document.addEventListener('visibilitychange', updateVisibility)
    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)
    element.addEventListener('focusin', focus)
    element.addEventListener('focusout', blur)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
      element.removeEventListener('focusin', focus)
      element.removeEventListener('focusout', blur)
    }
  }
}
