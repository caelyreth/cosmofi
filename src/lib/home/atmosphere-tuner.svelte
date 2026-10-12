<script lang="ts">
  import { Repeat2 } from 'lucide-svelte'
  import { cubicOut } from 'svelte/easing'
  import { prefersReducedMotion, Tween } from 'svelte/motion'

  import DirectionalText from '#lib/components/directional-text.svelte'
  import { autoCycle } from '#lib/motion/auto-cycle.svelte'
  import type { PaletteSelection } from '#lib/state/palette.svelte'
  import { families } from '#lib/theme/palette'

  import FamilySelector from './family-selector.svelte'

  interface Props {
    palette: PaletteSelection
  }

  let { palette }: Props = $props()

  const id = $props.id()

  const frequency = Tween.of(() => palette.channel, {
    duration: () => (prefersReducedMotion.current ? 0 : 550),
    easing: cubicOut,
  })

  const cycle = autoCycle({
    interval: 5500,
    value: () => palette.id,
    advance: () => {
      palette.advance()
    },
    enabled: () => palette.loopColors,
  })
</script>

<div
  class="receiver frame"
  role="group"
  aria-label="Atmosphere tuner"
  {@attach cycle}
>
  <div class="receiver-head">
    <div class="receiver-name">
      <span class="instrument-label">Tune the atmosphere</span>
      <strong aria-hidden="true" data-nosnippet>
        <span class="receiver-family-name">
          <DirectionalText
            value={palette.family.name}
            direction={palette.direction}
          />
        </span>
        <span class="mono">
          <DirectionalText
            value={palette.family.foreground}
            direction={palette.direction}
          />
        </span>
      </strong>
    </div>
    <div class="tuning-scale">
      <div class="scale-ticks" aria-hidden="true">
        {#each Array.from({ length: 57 }) as _, i}
          <i class:major={i % 8 === 0}></i>
        {/each}
      </div>
      <label class="sr-only" for={id}>Select a color family</label>
      <input
        {id}
        type="range"
        min="0"
        max={families.length - 1}
        step="1"
        bind:value={palette.channel}
        aria-valuetext={palette.family.name}
      />
      <span
        class="frequency-marker"
        style:--position={frequency.current / (families.length - 1)}
        aria-hidden="true"
      ></span>
    </div>
    <button
      class="loop-control"
      aria-label={palette.loopColors
        ? 'Pause color loop'
        : 'Start color loop'}
      aria-pressed={palette.loopColors}
      title={palette.loopColors
        ? 'Pause color loop'
        : 'Start color loop'}
      onclick={() => (palette.loopColors = !palette.loopColors)}
    >
      <Repeat2 size={15} aria-hidden="true" />
      <span>Color loop</span>
    </button>
  </div>
  <FamilySelector label="Transmission presets" bind:value={palette.id} />
  <div class="receiver-foot instrument-label" aria-hidden="true" data-nosnippet>
    <span>Eight families. One atmosphere.</span>
    <span>Cosmofi / Starfield</span>
  </div>
</div>

<style>
  .receiver {
    border-top: 1px solid var(--static-muted);
    padding-top: 12px;
  }

  .receiver-head {
    display: grid;
    grid-template-columns: 245px minmax(0, 1fr) 140px;
    align-items: center;
    gap: 32px;
    margin-bottom: 8px;
  }

  .receiver-name > span {
    font-size: var(--text-small);
    color: var(--secondary);
  }

  .receiver-name {
    min-width: 0;
  }

  .receiver-name strong {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 4px;
    color: var(--channel);
    font: 500 var(--text-title)/1.1 var(--font-brand);
    transition: color 400ms;
  }

  .receiver-family-name {
    width: 9ch;
    max-width: 100%;
  }

  .receiver-name .mono {
    font-size: var(--text-small);
    font-weight: 400;
  }

  .tuning-scale {
    position: relative;
    height: 40px;
  }

  .scale-ticks {
    display: flex;
    justify-content: space-between;
    height: 23px;
    border-bottom: 1px solid var(--static-muted);
  }

  .scale-ticks i {
    width: 1px;
    height: 7px;
    align-self: end;
    background: var(--static-muted);
  }

  .scale-ticks .major {
    height: 18px;
    background: var(--secondary);
  }

  input {
    appearance: none;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 40px;
    margin: 0;
    background: none;
    cursor: ew-resize;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    width: 7px;
    height: 36px;
    border: 2px solid var(--page);
    background: var(--channel);
    border-radius: 0;
    opacity: 0;
  }

  input::-moz-range-thumb {
    width: 3px;
    height: 32px;
    border: 2px solid var(--page);
    background: var(--channel);
    border-radius: 0;
    opacity: 0;
  }

  input::-webkit-slider-runnable-track {
    width: 100%;
    height: 40px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  input::-moz-range-track,
  input::-moz-range-progress {
    height: 40px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .frequency-marker {
    position: absolute;
    top: 2px;
    left: calc(3.5px + (100% - 7px) * var(--position));
    width: 7px;
    height: 36px;
    border: 2px solid var(--page);
    background: var(--channel);
    transform: translateX(-50%);
    pointer-events: none;
    transition: background 400ms;
  }

  .loop-control {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--secondary);
    font-size: var(--text-small);
    transition: color 300ms;
  }

  .loop-control[aria-pressed='true'] {
    color: var(--channel);
  }

  .loop-control:hover {
    color: var(--ink);
  }

  .receiver-foot {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 8px;
    color: var(--secondary);
    font-size: var(--text-small);
  }

  @media (max-width: 900px) {
    .receiver-head {
      grid-template-columns: minmax(0, 1fr) 140px;
      gap: 4px 16px;
      margin-bottom: 4px;
    }

    .loop-control {
      grid-column: 2;
      grid-row: 1;
    }

    .tuning-scale {
      grid-column: 1 / -1;
    }
  }

  @media (max-height: 500px) {
    .tuning-scale,
    .receiver-foot {
      display: none;
    }

    .receiver-head {
      margin-bottom: 0;
    }
  }

  @media (max-height: 400px) {
    .receiver :global(.family-selector) {
      grid-template-columns: repeat(8, minmax(0, 1fr));
    }

    .receiver :global(.family-selector button) {
      justify-content: center;
    }

    .receiver :global(.family-selector button > span:last-child) {
      display: none;
    }
  }

  @media (max-width: 900px) and (max-height: 600px) {
    .receiver-foot {
      display: none;
    }
  }
</style>
