<script lang="ts">
  import { rovingFocus } from '#lib/attachments/roving-focus'
  import DirectionalText from '#lib/components/directional-text.svelte'
  import { autoCycle } from '#lib/motion/auto-cycle.svelte'

  import { planeSeparation, surfaces } from './surfaces'

  let selected = $state(0)

  const surface = $derived(surfaces[selected])
  const channel = $derived(parseInt(surface.color.slice(1, 3), 16))
  const cycle = autoCycle({
    interval: 4500,
    value: () => selected,
    advance: (index) => {
      selected = (index + 1) % surfaces.length
    },
  })
</script>

<figure class="surface-study" {@attach cycle}>
  <figcaption class="figure-heading instrument-label">
    <span>Surface composition</span>
    <span>R = G = B</span>
  </figcaption>

  <div class="surface-layout">
    <div
      class="neutral-composition"
      style:--separation={`${planeSeparation * 0.45}px`}
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
        <span>
          <DirectionalText value={surface.name} direction={1} />
        </span>
        <strong class="mono">
          <DirectionalText value={surface.color} direction={1} />
        </strong>
      </div>

      <dl class="channel-register">
        {#each ['R', 'G', 'B'] as name}
          <div>
            <dt>{name}</dt>
            <dd>
              <span class="channel-track" aria-hidden="true">
                <i style:width={`${(channel / 255) * 100}%`}></i>
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
    transition: border-color 800ms ease;
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
    transition: width 800ms ease;
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
    transition:
      border-color 800ms ease,
      color 800ms ease;
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
  }
</style>
