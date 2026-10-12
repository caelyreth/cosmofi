<script lang="ts">
  import { Check, CircleAlert, Copy, LoaderCircle } from 'lucide-svelte'

  let {
    value,
    displayValue = value,
    label,
  }: { value: string; displayValue?: string; label?: string } = $props()
  let state = $state<'idle' | 'copying' | 'copied' | 'error'>('idle')
  let previousValue = ''

  $effect(() => {
    if (previousValue === value) {
      return
    }

    previousValue = value
    state = 'idle'
  })

  $effect(() => {
    if (state !== 'copied' && state !== 'error') {
      return
    }

    const timer = setTimeout(() => (state = 'idle'), 2400)
    return () => clearTimeout(timer)
  })

  async function copy() {
    const copiedValue = value
    state = 'copying'

    try {
      await navigator.clipboard.writeText(copiedValue)

      if (value === copiedValue) {
        state = 'copied'
      }
    } catch {
      if (value === copiedValue) {
        state = 'error'
      }
    }
  }
</script>

<span class="color-copy">
  <button
    type="button"
    class="copy-button"
    class:copied={state === 'copied'}
    class:error={state === 'error'}
    onclick={copy}
    disabled={state === 'copying'}
    aria-label={label ?? `Copy ${value}`}
    title={state === 'copied'
      ? 'Copied'
      : state === 'error'
        ? 'Clipboard unavailable'
        : (label ?? `Copy ${value}`)}
  >
    <span class="copy-value mono">{displayValue}</span>
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
    font-size: 11px;
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

    .copy-value {
      font-size: 10px;
    }
  }
</style>
