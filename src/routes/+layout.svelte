<script lang="ts">
  import '../app.css'
  import { onNavigate, type OnNavigate } from '$app/navigation'
  import { prefersReducedMotion } from 'svelte/motion'

  import favicon from '#lib/assets/favicon.svg'
  import SiteHeader from '#lib/components/site-header.svelte'
  import {
    Presentation,
    setPresentation,
  } from '#lib/presentation.svelte.js'
  import { siteStyle } from '#lib/theme.js'

  import type { LayoutProps } from './$types'

  let { children }: LayoutProps = $props()
  const presentation = new Presentation()
  setPresentation(presentation)

  let transition: ViewTransition | undefined

  function transitionDirection(navigation: OnNavigate) {
    return navigation.to?.url.pathname === '/' ? 'back' : 'forward'
  }

  function finishTransition(
    nextTransition: ViewTransition,
    resolve: () => void,
  ) {
    if (transition === nextTransition) {
      transition = undefined
      delete document.documentElement.dataset.routeTransition
    }

    resolve()
  }

  onNavigate((navigation) => {
    const skip = [
      !document.startViewTransition,
      prefersReducedMotion.current,
      navigation.from?.url.pathname === navigation.to?.url.pathname,
    ].some(Boolean)

    if (skip) {
      return
    }

    document.documentElement.dataset.routeTransition =
      transitionDirection(navigation)
    transition?.skipTransition()

    return new Promise<void>((resolve) => {
      const nextTransition = document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
      transition = nextTransition

      // Snapshot failures must never prevent navigation from completing.
      void nextTransition.finished.then(
        () => finishTransition(nextTransition, resolve),
        () => finishTransition(nextTransition, resolve),
      )
    })
  })

  function isEditing(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
      return false
    }

    return (
      target.matches('input, textarea, select, button') ||
      target.isContentEditable
    )
  }

  function tune(event: KeyboardEvent) {
    const modified = [
      event.defaultPrevented,
      event.metaKey,
      event.ctrlKey,
      event.altKey,
    ].some(Boolean)

    if (modified || isEditing(event.target)) {
      return
    }

    if (/^[1-8]$/.test(event.key)) {
      presentation.channel = Number(event.key) - 1
    }
  }
</script>

<svelte:window onkeydown={tune} />

<svelte:head>
  <link rel="icon" href={favicon} />
  <link
    rel="preload"
    href="/fonts/bricolage.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <meta name="theme-color" content="#161616" />
</svelte:head>

<div
  class="site"
  style={siteStyle}
  style:--channel={presentation.family.foreground}
  style:--channel-surface={presentation.family.surface}
>
  <a class="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <div class="route-content">
    {@render children()}
  </div>
</div>

<style>
  .route-content {
    min-width: 0;
    min-height: 0;
    height: 100%;
    view-transition-name: route-content;
  }
  .skip-link {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 60;
    padding: 12px 18px;
    background: var(--ink);
    color: var(--page);
    transform: translateY(-150%);
  }
  .skip-link:focus {
    transform: translateY(0);
  }
</style>
