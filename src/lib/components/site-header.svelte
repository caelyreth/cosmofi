<script lang="ts">
  import { page } from '$app/state'

  import favicon from '#lib/assets/favicon.svg'

  let home = $derived(page.url.pathname === '/')
  let reading = $derived(page.url.pathname === '/introduction')
</script>

<header class:reading>
  <a class="brand" href="/" aria-label="Cosmofi home">
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
</header>

<style>
  header {
    position: absolute;
    top: var(--header-top);
    left: var(--page-inset);
    z-index: 40;
    display: inline-flex;
    align-items: center;
    width: max-content;
    height: 44px;
    color: var(--ink);
  }

  .reading {
    isolation: isolate;
  }

  .reading::before {
    position: absolute;
    top: calc(-1 * var(--header-top));
    bottom: -28px;
    left: calc(-1 * var(--page-inset));
    z-index: -1;
    width: 40vw;
    background: rgb(22 22 22 / 45%);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 calc(100% - 28px),
      transparent
    );
    mask-image: linear-gradient(
      to bottom,
      #000 calc(100% - 28px),
      transparent
    );
    pointer-events: none;
    content: '';
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
    view-transition-name: cosmofi-wordmark;
  }

  @media (max-width: 700px) {
    .reading::before {
      width: 100vw;
    }
  }
</style>
