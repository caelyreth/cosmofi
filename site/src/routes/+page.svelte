<script lang="ts">
  import { prefersReducedMotion } from 'svelte/motion'

  import AtmosphereTuner from '#lib/home/atmosphere-tuner.svelte'
  import Hero from '#lib/home/hero.svelte'
  import { getPaletteSelection } from '#lib/state/palette.svelte'

  const palette = getPaletteSelection()
</script>

<svelte:head>
  <title>Cosmofi — Color from another frequency</title>
  <meta
    name="description"
    content="Cosmic color, lo-fi feeling. Cosmofi Starfield is a color scheme for terminals and code editors, with eight dusty color families and a little room for wonder."
  />
</svelte:head>

<main id="main" class="hero screen" tabindex="-1">
  <Hero family={palette.family} paused={prefersReducedMotion.current} />
  <AtmosphereTuner {palette} />
</main>

<style>
  .hero {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    padding-top: calc(var(--header-bottom) + 12px);
    padding-bottom: var(--content-bottom);
    background: var(--page);
  }
</style>
