<script lang="ts">
  import { overflowFocus } from '#lib/attachments/overflow-focus'
  import SpectrumRegister from '#lib/spectrum/spectrum-register.svelte'
  import { getPaletteSelection } from '#lib/state/palette.svelte'

  const palette = getPaletteSelection()
</script>

<svelte:head>
  <title>Spectrum — Cosmofi Starfield</title>
  <meta
    name="description"
    content="Explore Cosmofi Starfield's eight color families and their surface, muted, foreground, and emphasis swatches."
  />
</svelte:head>

<main id="main" class="spectrum-page screen" tabindex="-1">
  <div
    class="spectrum-content scroll-pane"
    tabindex="-1"
    role="region"
    aria-labelledby="spectrum-title"
    {@attach overflowFocus}
  >
    <div class="section-heading">
      <h1 id="spectrum-title">
        Not loud.<br /><span>Full of character.</span>
      </h1>
      <p>
        Eight color families, each with four related shades. Dusty, earthly,
        and a little otherworldly.
      </p>
    </div>

    <SpectrumRegister
      family={palette.family}
      direction={palette.direction}
      onselect={palette.select}
    />
  </div>
</main>

<style>
  .spectrum-page {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    padding: calc(var(--header-bottom) + 32px) var(--page-inset)
      max(24px, env(safe-area-inset-bottom));
  }

  .spectrum-content {
    display: flex;
    flex-direction: column;
    justify-content: safe center;
    width: 100%;
    max-width: 1440px;
    margin-inline: auto;
    padding: 4px 6px;
  }

  .section-heading {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 48px;
    margin-bottom: 24px;
  }

  h1 {
    font-size: var(--text-display);
    line-height: 1.02;
  }

  h1 span {
    color: var(--secondary);
  }

  .section-heading p {
    max-width: 310px;
    color: var(--secondary);
    font-size: var(--text-body);
    line-height: 1.85;
  }

  @media (max-width: 800px), (max-height: 750px) {
    h1 {
      font-size: var(--text-heading);
    }

    .section-heading {
      gap: 24px;
      margin-bottom: 20px;
    }
  }

  @media (max-width: 600px) {
    .spectrum-page {
      padding-top: calc(var(--header-bottom) + 24px);
      padding-bottom: max(16px, env(safe-area-inset-bottom));
    }

    .section-heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .section-heading p {
      max-width: 42ch;
      font-size: var(--text-small);
      line-height: 1.6;
    }
  }
</style>
