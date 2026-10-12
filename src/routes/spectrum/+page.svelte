<script lang="ts">
  import SpectrumRegister from '#lib/components/spectrum-register.svelte'
  import { getPresentation } from '#lib/presentation.svelte'

  const presentation = getPresentation()
</script>

<svelte:head>
  <title>Spectrum — Cosmofi Starfield</title>
  <meta
    name="description"
    content="Explore Cosmofi Starfield's eight color families and their surface, muted, foreground, and emphasis swatches."
  />
</svelte:head>

<main id="main" class="spectrum-page screen">
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (The spectrum accepts keyboard scrolling on compact screens.) -->
  <div
    class="spectrum-content scroll-pane"
    tabindex="0"
    role="region"
    aria-labelledby="spectrum-title"
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
      family={presentation.family}
      direction={presentation.direction}
      onselect={(id) => presentation.select(id)}
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
    font-size: 56px;
    line-height: 1.02;
  }

  h1 span {
    color: var(--secondary);
  }

  .section-heading p {
    max-width: 310px;
    color: var(--secondary);
    font-size: 12px;
    line-height: 1.85;
  }

  @media (max-width: 800px), (max-height: 750px) {
    h1 {
      font-size: 40px;
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

    h1 {
      font-size: 34px;
    }

    .section-heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .section-heading p {
      max-width: 42ch;
      font-size: 11px;
      line-height: 1.6;
    }
  }
</style>
