<script lang="ts">
  import { rovingFocus } from '#lib/attachments/roving-focus'
  import { base } from '#lib/theme'

  const surfaces = [
    { name: 'Background', color: base.background },
    { name: 'Working surface', color: '#1A1A1A' },
    { name: 'Raised plane', color: '#242424' },
  ]

  let selected = $state(1)
  let separation = $state(60)

  const surface = $derived(surfaces[selected])
  const channel = $derived(parseInt(surface.color.slice(1, 3), 16))
</script>

<figure class="surface-study">
  <figcaption class="figure-heading instrument-label">
    <span>Surface composition</span>
    <span>R = G = B</span>
  </figcaption>

  <div class="surface-layout">
    <div
      class="neutral-composition"
      style:--separation={`${separation * 0.45}px`}
      aria-hidden="true"
      data-nosnippet
    >
      <span class="composition-axis horizontal"></span>
      <span class="composition-axis vertical"></span>
      {#each surfaces as item, index}
        <div
          class="neutral-plane"
          class:chosen={selected === index}
          style:--plane={index - 1}
          style:background={item.color}
        >
          <span class="instrument-label">0{index + 1}</span>
        </div>
      {/each}
    </div>

    <div class="surface-reading">
      <div class="surface-heading">
        <span>{surface.name}</span>
        <strong class="mono">{surface.color}</strong>
      </div>

      <dl class="channel-register">
        {#each ['R', 'G', 'B'] as name}
          <div>
            <dt>{name}</dt>
            <dd>
              <span class="channel-track" aria-hidden="true">
                <i style:width={`${channel / 255 * 100}%`}></i>
              </span>
              <span class="mono">{channel}</span>
            </dd>
          </div>
        {/each}
      </dl>

      <p>Equal channels.<br />No color cast.</p>
    </div>
  </div>

  <div
    class="surface-choices"
    role="group"
    aria-label="Grayscale surfaces"
    {@attach rovingFocus}
  >
    {#each surfaces as item, index}
      <button
        type="button"
        aria-pressed={selected === index}
        tabindex={selected === index ? 0 : -1}
        onclick={() => (selected = index)}
      >
        <i style:background={item.color} aria-hidden="true"></i>
        <span>{item.name}</span>
      </button>
    {/each}
  </div>

  <div class="separation-control">
    <label for="surface-separation">Plane separation</label>
    <input
      id="surface-separation"
      type="range"
      min="0"
      max="100"
      step="1"
      bind:value={separation}
      aria-valuetext={`${separation} percent`}
    />
    <span class="mono" aria-hidden="true">{separation}%</span>
  </div>
</figure>

<style>
  .surface-study {
    display: grid;
    gap: 24px;
    width: 100%;
    margin: 0;
  }

  .figure-heading {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    color: var(--secondary);
  }

  .surface-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: center;
    gap: 24px;
  }

  .neutral-composition {
    position: relative;
    width: 100%;
    max-width: 340px;
    aspect-ratio: 1;
    justify-self: center;
  }

  .composition-axis {
    position: absolute;
    background: #333333;
  }

  .horizontal {
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
  }

  .vertical {
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
  }

  .neutral-plane {
    position: absolute;
    inset: 20%;
    display: flex;
    align-items: flex-end;
    padding: 12px;
    border: 1px solid #404040;
    color: var(--secondary);
    transform: translate(
      calc(var(--plane) * var(--separation)),
      calc(var(--plane) * var(--separation) * -1)
    );
    transition: transform 250ms ease-out, border-color 200ms;
  }

  .neutral-plane.chosen {
    border-color: var(--secondary);
  }

  .surface-reading {
    display: grid;
    gap: 24px;
    min-width: 0;
  }

  .surface-heading {
    display: grid;
    gap: 12px;
  }

  .surface-heading > span {
    color: var(--secondary);
    font-size: var(--text-small);
  }

  .surface-heading strong {
    font-size: var(--text-title);
    font-weight: 400;
  }

  .channel-register {
    display: grid;
    gap: 16px;
    margin: 0;
    font-size: var(--text-small);
    color: var(--secondary);
  }

  .channel-register > div {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
  }

  .channel-register dd {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 24px;
    align-items: center;
    gap: 12px;
    margin: 0;
    text-align: right;
  }

  .channel-track {
    height: 2px;
    background: #333333;
  }

  .channel-track i {
    display: block;
    height: 100%;
    background: var(--secondary);
    transition: width 200ms;
  }

  .surface-reading p {
    color: var(--secondary);
    font-size: var(--text-small);
    line-height: 1.7;
  }

  .surface-choices {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .surface-choices button {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 52px;
    padding-block: 8px;
    border-bottom: 1px solid #404040;
    color: var(--secondary);
    font-size: var(--text-small);
    line-height: 1.5;
  }

  .surface-choices button[aria-pressed='true'] {
    border-color: var(--ink);
    color: var(--ink);
  }

  .surface-choices i {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 1px solid #545454;
  }

  .separation-control {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 4ch;
    align-items: center;
    gap: 16px;
    min-height: 44px;
    color: var(--secondary);
    font-size: var(--text-small);
  }

  .separation-control > span {
    text-align: right;
  }

  input {
    appearance: none;
    width: 100%;
    min-width: 0;
    height: 44px;
    margin: 0;
    background: transparent;
    cursor: ew-resize;
  }

  input::-webkit-slider-runnable-track {
    height: 2px;
    background: #545454;
  }

  input::-moz-range-track {
    height: 2px;
    background: #545454;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    margin-top: -5px;
    border: 0;
    border-radius: 50%;
    background: var(--ink);
  }

  input::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border: 0;
    border-radius: 50%;
    background: var(--ink);
  }

  @media (max-width: 700px) {
    .surface-heading strong {
      font-size: var(--text-body);
    }

    .surface-reading {
      gap: 20px;
    }

    .surface-choices {
      gap: 12px;
    }

    .separation-control {
      grid-template-columns: minmax(0, 1fr) 4ch;
    }

    .separation-control label {
      grid-column: 1 / -1;
    }
  }
</style>
