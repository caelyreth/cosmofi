<script lang="ts">
  import { rovingFocus } from '#lib/attachments/roving-focus'
  import { families, type FamilyId } from '#lib/theme/palette'

  interface Props {
    value?: FamilyId
    label?: string
  }

  let {
    value = $bindable<FamilyId>('halo'),
    label = 'Color family',
  }: Props = $props()
</script>

<div class="family-selector" role="group" aria-label={label} {@attach rovingFocus}>
  {#each families as family}
    <button
      type="button"
      aria-label={`Tune ${family.name}`}
      title={`Tune ${family.name}`}
      aria-pressed={value === family.id}
      tabindex={value === family.id ? 0 : -1}
      style:--swatch={family.foreground}
      onclick={() => (value = family.id)}
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
    font-family: var(--font-brand);
    font-size: var(--text-small);
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
    }
  }
</style>
