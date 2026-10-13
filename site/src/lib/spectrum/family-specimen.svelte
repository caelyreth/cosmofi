<script lang="ts">
  import type { Family } from 'cosmofi-starfield'

  import DirectionalText from '#lib/components/directional-text.svelte'
  import type { Direction } from '#lib/motion/direction'

  import SwatchTable from './swatch-table.svelte'

  interface Props {
    family: Family
    direction: Direction
  }

  let { family, direction }: Props = $props()
</script>

<div class="family-specimen" style:--family={family.foreground}>
  <div class="specimen-description">
    <div>
      <h3>
        <DirectionalText value={family.name} {direction} />
      </h3>
      <p aria-live="polite">
        <DirectionalText value={family.description} {direction} />
      </p>
    </div>
    <span class="instrument-label">Four swatches / sRGB</span>
  </div>
  <SwatchTable {family} />
</div>

<style>
  .family-specimen {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2.6fr);
    align-items: start;
    gap: 40px;
    padding: 26px 0;
    border-bottom: 1px solid var(--static-muted);
  }

  h3 {
    color: var(--family);
    font-family: var(--font-brand);
    font-size: var(--text-heading);
    letter-spacing: 0;
    transition: color 400ms;
  }

  .specimen-description p {
    color: var(--secondary);
    font-size: var(--text-small);
    margin-top: 9px;
  }

  .specimen-description {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .specimen-description > .instrument-label {
    color: var(--secondary);
    font-size: var(--text-small);
  }

  @media (max-width: 700px) {
    .family-specimen {
      grid-template-columns: 1fr;
      gap: 14px;
      padding-block: 18px;
    }

    h3 {
      font-size: var(--text-title);
    }

    .specimen-description p {
      margin-top: 5px;
    }
  }
</style>
