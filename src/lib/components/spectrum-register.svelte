<script lang="ts">
  import { colorFormats, readableInk } from '#lib/color.js'
  import { families, roles, type Family } from '#lib/theme.js'

  import ColorCopy from './color-copy.svelte'
  import DirectionalText from './directional-text.svelte'

  let {
    family,
    onselect,
    direction,
  }: {
    family: Family
    onselect: (id: Family['id']) => void
    direction: -1 | 1
  } = $props()
</script>

<div class="spectrum-register">
  <div
    class="spectrum-bands"
    role="group"
    aria-label="Explore color families"
  >
    {#each families as item}
      <button
        class="band"
        class:selected={item.id === family.id}
        style:--field={item.foreground}
        style:--band-ink={readableInk(item.foreground)}
        aria-pressed={item.id === family.id}
        aria-label={`Select ${item.name}`}
        onclick={() => onselect(item.id)}
      >
        <span class="band-name">{item.name}</span>
        <span class="band-description">{item.description}</span>
        <span class="band-code mono">
          {item.foreground}
        </span>
        <span class="shade-stack" aria-hidden="true">
          {#each roles as role}
            <i style:background={item[role]}></i>
          {/each}
        </span>
        <span class="band-corner" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M5 19 19 5M5 5h14v14" />
          </svg>
        </span>
      </button>
    {/each}
  </div>
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
    <div class="swatch-register">
      <div class="specimen-swatches">
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
  </div>
</div>

<style>
  .spectrum-bands {
    display: flex;
    gap: 3px;
    height: clamp(220px, 31svh, 310px);
  }
  .band {
    position: relative;
    min-width: 0;
    flex: 1;
    border: 0;
    border-radius: 0;
    padding: 22px 14px;
    background: var(--field);
    color: var(--band-ink);
    text-align: left;
    overflow: hidden;
    transition:
      flex-grow 550ms cubic-bezier(0.16, 1, 0.3, 1),
      background 400ms,
      color 400ms;
  }
  .band.selected {
    flex: 2.7;
  }
  .band-name {
    position: absolute;
    top: 35px;
    left: 46px;
    white-space: nowrap;
    transform: rotate(90deg);
    transform-origin: left top;
    font:
      500 32px/1 'Bricolage',
      sans-serif;
    letter-spacing: 0;
  }
  .band.selected .band-name {
    left: 14px;
    transform: rotate(0deg) scale(1.3);
  }
  .band-description {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 250ms,
      transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    position: absolute;
    top: 106px;
    left: 14px;
    right: 22px;
    font-size: 12px;
    line-height: 1.7;
  }
  .band.selected .band-description {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 160ms;
  }
  .band-code {
    position: absolute;
    bottom: 62px;
    left: 14px;
    font-size: 12px;
    white-space: nowrap;
  }
  .shade-stack {
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    height: 39px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .band-corner {
    position: absolute;
    bottom: 59px;
    right: 16px;
    display: none;
  }
  .band.selected .band-corner {
    display: block;
  }
  .band-name {
    transition:
      transform 650ms cubic-bezier(0.16, 1, 0.3, 1),
      left 650ms cubic-bezier(0.16, 1, 0.3, 1);
  }
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
    font-size: 36px;
    letter-spacing: 0;
    transition: color 400ms;
  }
  .specimen-description p {
    color: var(--secondary);
    font-size: 12px;
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
    font-size: 8px;
  }
  .swatch-register {
    min-width: 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }

  .specimen-swatches {
    display: grid;
    grid-template-columns: 38px repeat(4, minmax(0, 1fr));
    grid-template-rows: 44px auto repeat(4, minmax(44px, auto));
    column-gap: 17px;
  }

  .format-labels,
  .specimen-color {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: 1 / span 6;
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
    font-size: 10px;
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
    font-size: 10px;
  }
  @media (max-width: 1000px) {
    .spectrum-bands {
      height: clamp(220px, 31svh, 280px);
    }
    .band {
      padding-inline: 10px;
    }
    .band-description,
    .band-code {
      left: 10px;
    }
    .band.selected {
      flex: 2.4;
    }
    .band.selected .band-name {
      left: 10px;
      font-size: 28px;
      transform: rotate(0deg);
    }
    .band-code {
      font-size: 12px;
    }
    .band.selected .band-corner {
      display: none;
    }
  }
  @media (max-width: 700px) {
    .spectrum-bands {
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      height: 38px;
      gap: 3px;
    }
    .band {
      height: 38px;
      padding: 0;
      opacity: 0.58;
      transition: opacity 220ms;
    }
    .band.selected {
      opacity: 1;
    }
    .band-name,
    .band-description,
    .band-code,
    .band-corner,
    .shade-stack {
      display: none;
    }
    .family-specimen {
      grid-template-columns: 1fr;
      gap: 14px;
      padding-block: 18px;
    }
    h3 {
      font-size: 28px;
    }
    .specimen-swatches {
      min-width: 660px;
      column-gap: 16px;
    }
    .format-labels {
      position: sticky;
      left: 0;
      z-index: 2;
      background: var(--page);
    }
    .format-label {
      font-size: 9px;
    }
    .specimen-color > .instrument-label {
      font-size: 9px;
      overflow-wrap: anywhere;
      margin-top: 8px;
    }

    .specimen-description p {
      margin-top: 5px;
      font-size: 11px;
    }

  }
  .shade-stack i {
    transform-origin: bottom;
    transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
    transform: scaleY(0.72);
  }
  .band.selected .shade-stack i {
    transform: scaleY(1);
  }
</style>
