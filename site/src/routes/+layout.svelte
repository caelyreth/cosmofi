<script lang="ts">
  import '../app.css'
  import { base } from 'cosmofi'

  import favicon from '#lib/assets/favicon.svg'
  import SiteHeader from '#lib/components/site-header.svelte'
  import { registerRouteTransitions } from '#lib/navigation/transitions'
  import { paletteKeyboard } from '#lib/state/palette-keyboard'
  import { providePaletteSelection } from '#lib/state/palette.svelte'
  import { siteStyle } from '#lib/theme/site-style'

  import type { LayoutProps } from './$types'

  let { children }: LayoutProps = $props()

  const palette = providePaletteSelection()
  const tune = paletteKeyboard(palette)

  registerRouteTransitions()
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
  <meta name="theme-color" content={base.background} />
</svelte:head>

<div
  class="site"
  style={siteStyle}
  style:--channel={palette.family.foreground}
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
