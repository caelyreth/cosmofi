<script lang="ts">
  import { Check, CircleAlert, Copy, LoaderCircle } from 'lucide-svelte'

  import { createClipboard } from '#lib/state/clipboard.svelte'

  interface Props {
    value: string
    displayValue?: string
    label?: string
  }

  let { value, displayValue, label }: Props = $props()

  const clipboard = createClipboard(() => value)
  const state = $derived(clipboard.status)
  const displayed = $derived(displayValue ?? value)
</script>

<span class="color-copy">
  <button
    type="button"
    class="copy-button"
    class:copied={state === 'copied'}
    class:error={state === 'error'}
    onclick={clipboard.copy}
    disabled={state === 'copying'}
    aria-label={label ?? `Copy ${value}`}
    title={state === 'copied'
      ? 'Copied'
      : state === 'error'
        ? 'Clipboard unavailable'
        : (label ?? `Copy ${value}`)}
  >
    <span class="copy-value mono">{displayed}</span>
    <span class="copy-icon" aria-hidden="true">
      {#if state === 'copied'}
        <Check size={14} />
      {:else if state === 'error'}
        <CircleAlert size={14} />
      {:else if state === 'copying'}
        <LoaderCircle size={14} />
      {:else}
        <Copy size={14} />
      {/if}
    </span>
  </button>
  <span class="sr-only" role="status">
    {state === 'copied'
      ? `Copied ${value}`
      : state === 'error'
        ? 'Clipboard unavailable'
        : ''}
  </span>
</span>

<style>
  .color-copy {
    display: flex;
    min-width: 0;
    width: 100%;
  }

  .copy-value {
    font-size: var(--text-small);
    line-height: 1.65;
    overflow-wrap: anywhere;
    user-select: text;
    font-variant-numeric: tabular-nums;
  }

  button {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 32px;
    align-items: center;
    gap: 8px;
    min-width: 0;
    min-height: 44px;
    width: 100%;
    border: 0;
    background: transparent;
    color: var(--ink);
    padding: 0;
    text-align: left;
  }

  .copy-icon {
    display: grid;
    place-items: center;
    color: var(--secondary);
    opacity: 0;
    transition: opacity 180ms, color 180ms;
  }

  button:hover .copy-icon,
  button:focus-visible .copy-icon {
    opacity: 1;
  }

  .copied .copy-icon {
    color: var(--life-foreground);
  }

  .error .copy-icon {
    color: var(--afterglow-foreground);
  }

  @media (max-width: 600px) {
    button {
      gap: 4px;
    }
  }
</style>
