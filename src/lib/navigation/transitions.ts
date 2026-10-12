import { browser } from '$app/env'
import { onNavigate, type OnNavigate } from '$app/navigation'
import { onDestroy } from 'svelte'
import { prefersReducedMotion } from 'svelte/motion'

export function registerRouteTransitions() {
  let active: ViewTransition | undefined

  function clear(transition?: ViewTransition) {
    if (transition && active !== transition) {
      return
    }

    active = undefined

    if (browser) {
      delete document.documentElement.dataset.routeTransition
    }
  }

  onNavigate((navigation: OnNavigate) => {
    active?.skipTransition()

    if (
      !document.startViewTransition ||
      prefersReducedMotion.current ||
      navigation.from?.url.pathname === navigation.to?.url.pathname
    ) {
      clear()
      return
    }

    document.documentElement.dataset.routeTransition =
      navigation.to?.route.id === '/' ? 'back' : 'forward'

    return new Promise<void>((resolve) => {
      let transition: ViewTransition

      try {
        transition = document.startViewTransition(async () => {
          resolve()
          await navigation.complete
        })
      } catch {
        clear()
        resolve()
        return
      }

      active = transition

      function finish() {
        clear(transition)
        resolve()
      }

      // A rejected snapshot must never leave navigation waiting.
      void transition.finished.then(finish, finish)
    })
  })

  onDestroy(() => {
    active?.skipTransition()
    clear()
  })
}
