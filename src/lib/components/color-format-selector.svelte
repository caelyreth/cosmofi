<script lang="ts">
  import { colorFormats, type ColorFormat } from '#lib/color.js'

  let { value = $bindable<ColorFormat>('hex') } = $props()
</script>

<div class="format-selector" role="group" aria-label="Color copy format">
  {#each colorFormats as format}
    <button
      type="button"
      aria-pressed={value === format.id}
      onclick={() => (value = format.id)}>{format.label}</button
    >
  {/each}
</div>

<style>
  .format-selector {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    width: 240px;
    max-width: 100%;
  }

  button {
    min-width: 0;
    height: 44px;
    padding: 8px 4px;
    border-bottom: 2px solid var(--static-muted);
    color: var(--secondary);
    font-size: 11px;
    text-align: center;
    transition:
      color 180ms,
      background 180ms,
      border-color 180ms;
  }

  button[aria-pressed='true'] {
    border-color: var(--channel);
    background: color-mix(in srgb, var(--ink) 6%, transparent);
    color: var(--ink);
  }

  button:hover {
    color: var(--ink);
  }
</style>
