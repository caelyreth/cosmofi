<script lang="ts">
  import { overflowFocus } from '#lib/attachments/overflow-focus'
  import ColorCopy from '#lib/components/color-copy.svelte'
  import { colorFormats } from '#lib/theme/color'
  import { roles, type Family } from '#lib/theme/palette'

  let { family }: { family: Family } = $props()
</script>

<div
  class="swatch-register"
  role="region"
  aria-label={`${family.name} swatches and color values`}
  tabindex="-1"
  {@attach overflowFocus}
>
  <div
    class="specimen-swatches"
    style:--format-count={colorFormats.length}
    style:--row-count={colorFormats.length + 2}
  >
    <div class="format-labels" aria-hidden="true">
      {#each colorFormats as format, index (format.id)}
        <span
          class="format-label instrument-label"
          style:grid-row={index + 3}
        >{format.label}</span>
      {/each}
    </div>

    {#each roles as role (role)}
      <div class="specimen-color">
        <div
          style:background={family[role]}
          class="color-sample"
          aria-hidden="true"
        ></div>
        <span class="instrument-label">{role}</span>

        {#each colorFormats as format (format.id)}
          <div class="format-row">
            <ColorCopy
              color={family[role]}
              format={format.id}
              name={`${family.name} ${role}`}
            />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .swatch-register {
    min-width: 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }

  .specimen-swatches {
    display: grid;
    grid-template-columns: 48px repeat(4, minmax(0, 1fr));
    grid-template-rows: 44px auto repeat(var(--format-count), minmax(44px, auto));
    column-gap: 17px;
  }

  .format-labels,
  .specimen-color {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: 1 / span var(--row-count);
  }

  .format-labels {
    grid-column: 1;
    align-items: center;
  }

  .specimen-color {
    min-width: 0;
  }

  .color-sample {
    display: block;
    width: 100%;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 0;
    transition: background 400ms;
  }

  .specimen-color > .instrument-label {
    display: block;
    margin-block: 13px 8px;
    color: var(--secondary);
    font-size: var(--text-small);
  }

  .format-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: stretch;
    min-height: 44px;
  }

  .format-row + .format-row {
    border-top: 1px solid
      color-mix(in srgb, var(--static-muted) 25%, transparent);
  }

  .format-label {
    color: var(--secondary);
    font-size: var(--text-small);
  }

  @media (max-width: 700px) {
    .specimen-swatches {
      min-width: 760px;
      column-gap: 16px;
    }

    .format-labels {
      position: sticky;
      left: 0;
      z-index: 2;
      background: var(--page);
    }

    .specimen-color > .instrument-label {
      overflow-wrap: anywhere;
      margin-top: 8px;
    }
  }
</style>
