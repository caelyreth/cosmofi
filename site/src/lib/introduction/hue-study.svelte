<script lang="ts">
  import { familyById, type FamilyId } from 'cosmofi-starfield'

  import { rovingFocus } from '#lib/attachments/roving-focus'
  import { colorHue } from '#lib/theme/color'

  import { omittedArc, point, segments } from './hue-wheel'

  let selected = $state<FamilyId>('halo')

  const family = $derived(familyById[selected])
  const hue = $derived(colorHue(family.foreground))
  const marker = $derived(point(hue, 125))
</script>

<figure class="hue-study">
  <figcaption class="figure-heading instrument-label">
    <span>Color range</span>
    <span>Hue / OKLCH</span>
  </figcaption>

  <div
    class="hue-wheel"
    role="group"
    aria-label="Color hue circle. The dashed arc marks omitted cyan and blue."
    {@attach rovingFocus}
  >
    {#each segments as segment (segment.id)}
      <button
        type="button"
        aria-label={`${segment.name}, ${Math.round(segment.hue)} degrees, ${segment.foreground}`}
        aria-pressed={selected === segment.id}
        tabindex={selected === segment.id ? 0 : -1}
        style:clip-path={segment.hitArea}
        onclick={() => (selected = segment.id)}
      >
        <svg
          viewBox="0 0 340 340"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            class="focus-ring"
            cx="170"
            cy="170"
            r="125"
            pathLength="360"
            stroke-width="28"
            stroke-dasharray={`${segment.length} ${360 - segment.length}`}
            stroke-dashoffset={-segment.start}
            transform="rotate(-90 170 170)"
          />
          <circle
            class="hue-segment"
            cx="170"
            cy="170"
            r="125"
            pathLength="360"
            stroke={segment.foreground}
            stroke-width="20"
            stroke-dasharray={`${segment.length} ${360 - segment.length}`}
            stroke-dashoffset={-segment.start}
            transform="rotate(-90 170 170)"
          />
        </svg>
      </button>
    {/each}

    <svg
      class="wheel-guides"
      viewBox="0 0 340 340"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle class="inner-guide" cx="170" cy="170" r="94" />
      <path class="omitted-arc" d={omittedArc} />
      <circle
        class="hue-marker"
        cx={marker.x}
        cy={marker.y}
        r="7"
        fill={family.foreground}
      />
    </svg>

    <div class="wheel-center" aria-hidden="true" data-nosnippet>
      <span class="instrument-label">{Math.round(hue)} deg</span>
      <strong style:color={family.foreground}>{family.name}</strong>
      <span class="mono">{family.foreground}</span>
    </div>
  </div>

  <div class="hue-foot">
    <span class="omission-key">
      <i aria-hidden="true"></i>
      <span>Cyan / Blue omitted</span>
    </span>
  </div>
</figure>

<style>
  .hue-study {
    display: grid;
    gap: 24px;
    width: 100%;
    margin: 0;
  }

  .figure-heading,
  .hue-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
    color: var(--secondary);
    font-size: var(--text-small);
  }

  .hue-wheel {
    position: relative;
    width: min(
      100%,
      580px,
      max(
        300px,
        calc(100svh - var(--content-top) - var(--content-bottom) - 112px)
      )
    );
    aspect-ratio: 1;
    justify-self: center;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hue-segment {
    opacity: 0.5;
    transition: opacity 250ms;
  }

  button[aria-pressed='true'] .hue-segment,
  button:hover .hue-segment,
  button:focus-visible .hue-segment {
    opacity: 1;
  }

  button {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  button:focus-visible {
    outline: none;
  }

  .focus-ring {
    stroke: var(--ink);
    opacity: 0;
  }

  button:focus-visible .focus-ring {
    opacity: 1;
  }

  .wheel-guides {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .inner-guide {
    stroke: #404040;
    stroke-dasharray: 1 8;
  }

  .omitted-arc {
    stroke: var(--secondary);
    stroke-width: 2;
    stroke-dasharray: 3 7;
  }

  .hue-marker {
    stroke: var(--panel);
    stroke-width: 4;
    transition:
      cx 250ms ease-out,
      cy 250ms ease-out;
  }

  .wheel-center {
    position: absolute;
    inset: 32% 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    color: var(--secondary);
    font-size: var(--text-small);
    pointer-events: none;
  }

  .wheel-center strong {
    font-family: var(--font-brand);
    font-size: var(--text-title);
    font-weight: 500;
    transition: color 250ms;
  }

  .hue-foot {
    padding-top: 20px;
    border-top: 1px solid #333333;
  }

  .omission-key {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .omission-key i {
    width: 24px;
    border-top: 1px dashed var(--secondary);
  }

  @media (max-width: 700px) {
    .hue-wheel {
      width: min(100%, 420px);
    }
  }
</style>
