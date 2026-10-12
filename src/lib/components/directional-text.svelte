<script lang="ts">
  import { cubicOut } from 'svelte/easing'
  import { prefersReducedMotion } from 'svelte/motion'
  import { fly } from 'svelte/transition'

  let { value, direction }: { value: string; direction: -1 | 1 } = $props()

  const motion = (side: number) => ({
    x: side * 20,
    duration: prefersReducedMotion.current ? 0 : 400,
    easing: cubicOut,
  })
</script>

<span class="directional-text">
  <span class="sr-only">{value}</span>
  {#each [value] as text (text)}
    <span
      class="text"
      aria-hidden="true"
      data-nosnippet
      in:fly={motion(-direction)}
      out:fly={motion(direction)}>{text}</span
    >
  {/each}
</span>

<style>
  .directional-text {
    display: inline-grid;
    max-width: 100%;
    vertical-align: baseline;
  }

  .text {
    grid-area: 1 / 1;
  }
</style>
