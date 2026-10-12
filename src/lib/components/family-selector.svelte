<script lang="ts">
  import { getPresentation } from '#lib/presentation.svelte'
  import { families } from '#lib/theme'

  let { label = 'Color family' }: { label?: string } = $props()
  const presentation = getPresentation()
</script>

<div class="family-selector" role="group" aria-label={label}>
  {#each families as family}
    <button
      aria-label={`Tune ${family.name}`}
      title={`Tune ${family.name}`}
      aria-pressed={presentation.family.id === family.id}
      style:--swatch={family.foreground}
      onclick={() => presentation.select(family.id)}
    >
      <span class="swatch" aria-hidden="true"></span>
      <span>{family.name}</span>
    </button>
  {/each}
</div>

<style>
  .family-selector {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 12px;
  }

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    min-height: 44px;
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--static-muted);
    background: none;
    color: var(--secondary);
    font-size: 12px;
    transition:
      color 180ms,
      border-color 180ms;
  }

  button[aria-pressed='true'] {
    color: var(--swatch);
    border-color: var(--swatch);
  }

  button:hover {
    color: var(--ink);
  }

  .swatch {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    background: var(--swatch);
  }

  button > span:last-child {
    overflow-wrap: anywhere;
  }

  @media (max-width: 900px) {
    .family-selector {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 4px 12px;
    }
  }

  @media (max-width: 600px) {
    button {
      gap: 6px;
      font-size: 11px;
    }
  }
</style>
