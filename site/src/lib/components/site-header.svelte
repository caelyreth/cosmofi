<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  import favicon from '#lib/assets/favicon.svg'

  import ThemeSwitch from './theme-switch.svelte'

  const home = $derived(page.route.id === '/')
  const reading = $derived(page.route.id === '/introduction')
</script>

<header>
  <div class="lockup" class:reading>
    <span class="capsule" aria-hidden="true" data-nosnippet></span>
    <a class="brand" href={resolve('/')} aria-label="Cosmofi home">
      <img
        src={favicon}
        width="32"
        height="32"
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      {#if !home}
        <span class="wordmark">cosmofi</span>
      {/if}
    </a>
  </div>
  <ThemeSwitch {reading} />
</header>

<style>
  header {
    position: absolute;
    top: var(--header-top);
    right: var(--page-inset);
    left: var(--page-inset);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    color: var(--ink);
  }

  .lockup {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    width: max-content;
    height: 44px;
  }

  .capsule {
    position: absolute;
    inset: -4px 0;
    z-index: -1;
    border-radius: 999px;
    background: var(--panel);
    opacity: 0;
    transform: scaleX(0.85);
    transform-origin: left center;
    transition:
      opacity 240ms ease,
      transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  .reading .capsule {
    opacity: 1;
    transform: scaleX(1);
    view-transition-name: cosmofi-capsule;
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

  .reading .brand {
    padding-inline: 20px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    text-decoration: none;
  }

  .brand img {
    flex-shrink: 0;
    view-transition-name: cosmofi-icon;
  }

  .wordmark {
    display: block;
    width: fit-content;
    font: 600 var(--text-title)/0.88 var(--font-brand);
    font-optical-sizing: none;
  }

  :global(:root[data-route-transition]) .wordmark {
    view-transition-name: cosmofi-wordmark;
  }
</style>
