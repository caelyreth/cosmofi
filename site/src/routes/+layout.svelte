<script lang="ts">
  import { untrack } from 'svelte'

  import '../app.css'
  import favicon from '#lib/assets/favicon.svg'
  import SiteHeader from '#lib/components/site-header.svelte'
  import { registerRouteTransitions } from '#lib/navigation/transitions'
  import { paletteKeyboard } from '#lib/state/palette-keyboard'
  import { providePaletteSelection } from '#lib/state/palette.svelte'
  import { provideTheme } from '#lib/state/theme.svelte'
  import { siteStyle } from '#lib/theme/site-style'

  import type { LayoutProps } from './$types'

  let { children, data }: LayoutProps = $props()

  const appearance = provideTheme(untrack(() => data.theme))
  const palette = providePaletteSelection(appearance)
  const tune = paletteKeyboard(palette)
  const style = $derived(siteStyle(appearance.theme))

  registerRouteTransitions()
</script>

<svelte:window onkeydown={tune} />
<svelte:body
  style:background-color={appearance.theme.surfaces.background}
  style:color-scheme={appearance.scheme}
/>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link
    rel="preload"
    href="/fonts/bricolage.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/manrope.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <meta name="theme-color" content={appearance.theme.surfaces.background} />
</svelte:head>

<div
  class="site"
  {style}
  style:--channel={palette.family.foreground}
  data-theme={appearance.id}
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
