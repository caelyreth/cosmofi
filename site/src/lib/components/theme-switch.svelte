<script lang="ts">
  import { themeIds, themes } from 'cosmofi'

  import { getThemeSelection } from '#lib/state/theme.svelte'

  interface Props {
    reading?: boolean
  }

  let { reading = false }: Props = $props()

  const appearance = getThemeSelection()
</script>

<div class="theme-switch" class:reading role="group" aria-label="Theme">
  <span class="capsule" aria-hidden="true" data-nosnippet></span>
  <div class="labels">
    {#each themeIds as id (id)}
      <button
        type="button"
        aria-pressed={appearance.id === id}
        onclick={() => appearance.select(id)}
      >
        {themes[id].name}
      </button>
    {/each}
  </div>
</div>

<style>
  .theme-switch {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    height: 44px;
  }

  .labels {
    display: flex;
    align-items: center;
    gap: 16px;
    view-transition-name: cosmofi-theme;
  }

  .capsule {
    position: absolute;
    inset: -4px 0;
    z-index: -1;
    border-radius: 999px;
    background: var(--panel);
    opacity: 0;
    transform: scaleX(0.85);
    transform-origin: right center;
    transition:
      opacity 240ms ease,
      transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  .reading .capsule {
    opacity: 1;
    transform: scaleX(1);
    view-transition-name: cosmofi-theme-capsule;
  }

  .reading {
    padding-inline: 20px;
  }

  :global(:root[data-route-transition]) .capsule {
    transition: none;
  }

  @starting-style {
    .reading .capsule {
      opacity: 0;
      transform: scaleX(0.85);
    }
  }

  button {
    height: 44px;
    font-size: var(--text-small);
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    color: var(--secondary);
  }

  button[aria-pressed='true'] {
    color: var(--ink);
  }
</style>
