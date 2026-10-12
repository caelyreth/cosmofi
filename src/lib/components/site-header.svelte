<script lang="ts">
  import { page } from '$app/state'

  import favicon from '#lib/assets/favicon.svg'

  let home = $derived(page.url.pathname === '/')
</script>

<header>
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
</style>
