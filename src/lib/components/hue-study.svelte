<script lang="ts">
  import { rovingFocus } from '#lib/attachments/roving-focus'
  import { colorHue } from '#lib/color'
  import { families, familyById, type FamilyId } from '#lib/theme'

  let selected = $state<FamilyId>('halo')
  let preview = $state<FamilyId>()

  const hueFamilies = families
    .filter((family) => family.id !== 'static' && family.id !== 'moonveil')
    .map((family) => ({ ...family, hue: colorHue(family.foreground) }))
    .sort((a, b) => a.hue - b.hue)

  const segments = hueFamilies.map((family, index) => {
    const previousIndex = (index + hueFamilies.length - 1) % hueFamilies.length
    const previous = hueFamilies[previousIndex]
    const next = hueFamilies[(index + 1) % hueFamilies.length]
    const previousHue = previous.hue - (index === 0 ? 360 : 0)
    const nextHue = next.hue + (index === hueFamilies.length - 1 ? 360 : 0)
    let start = (previousHue + family.hue) / 2
    let end = (family.hue + nextHue) / 2

    if (start > 190 && start < 275) {
      start = 275
    }

    if (end > 190 && end < 275) {
      end = 190
    }

    return { ...family, start: start + 1, length: end - start - 2 }
  })

  const family = $derived(familyById[preview ?? selected])
  const hue = $derived(hueFamilies.find((item) => item.id === family.id)?.hue)
  const marker = $derived(hue === undefined ? undefined : point(hue, 125))

  function point(angle: number, radius: number) {
    const radians = (angle - 90) * Math.PI / 180

    return {
      x: 170 + Math.cos(radians) * radius,
      y: 170 + Math.sin(radians) * radius,
    }
  }

  const omittedStart = point(190, 125)
  const omittedEnd = point(275, 125)
  const omittedArc = `M ${omittedStart.x} ${omittedStart.y} A 125 125 0 0 1 ${omittedEnd.x} ${omittedEnd.y}`
</script>

<figure class="hue-study">
  <figcaption class="figure-heading instrument-label">
    <span>Color range</span>
    <span>Hue / OKLCH</span>
  </figcaption>

  <div class="hue-layout">
    <div class="hue-wheel" aria-hidden="true" data-nosnippet>
      <svg viewBox="0 0 340 340" fill="none" focusable="false">
        <circle class="inner-guide" cx="170" cy="170" r="94" />
        {#each segments as segment (segment.id)}
          <circle
            cx="170"
            cy="170"
            r="125"
            pathLength="360"
            stroke={segment.foreground}
            stroke-width="20"
            stroke-dasharray={`${segment.length} ${360 - segment.length}`}
            stroke-dashoffset={-segment.start}
            transform="rotate(-90 170 170)"
            class:dimmed={hue !== undefined && family.id !== segment.id}
          />
        {/each}
        <path class="omitted-arc" d={omittedArc} />
        {#if marker}
          <circle
            class="hue-marker"
            cx={marker.x}
            cy={marker.y}
            r="7"
            fill={family.foreground}
          />
        {/if}
      </svg>
      <div class="wheel-center">
        <span class="instrument-label">
          {hue === undefined ? 'Neutral' : `${Math.round(hue)} deg`}
        </span>
        <strong style:color={family.foreground}>{family.name}</strong>
        <span class="mono">{family.foreground}</span>
      </div>
    </div>

    <div
      class="hue-choices"
      role="group"
      aria-label="Color families in the hue study"
      {@attach rovingFocus}
    >
      {#each families as item (item.id)}
        <button
          type="button"
          aria-pressed={selected === item.id}
          tabindex={selected === item.id ? 0 : -1}
          style:--swatch={item.foreground}
          onclick={() => (selected = item.id)}
          onpointerenter={() => (preview = item.id)}
          onpointerleave={() => (preview = undefined)}
          onfocus={() => (preview = undefined)}
        >
          <i aria-hidden="true"></i>
          <span class="color-labels">
            <span class="family-name">{item.name}</span>
            <span class="family-hex mono">{item.foreground}</span>
          </span>
        </button>
      {/each}
    </div>
  </div>

  <div class="hue-foot">
    <span class="omission-key">
      <i aria-hidden="true"></i>
      <span>Cyan / Blue omitted</span>
    </span>
    <span>Six accents / Two neutrals</span>
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

  .hue-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    align-items: center;
    gap: 24px;
  }

  .hue-wheel {
    position: relative;
    width: 100%;
    max-width: 360px;
    aspect-ratio: 1;
    justify-self: center;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  svg circle {
    transition: opacity 250ms;
  }

  .dimmed {
    opacity: 0.45;
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
    transition: cx 250ms ease-out, cy 250ms ease-out;
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
  }

  .wheel-center strong {
    font-family: var(--font-brand);
    font-size: var(--text-title);
    font-weight: 500;
    transition: color 250ms;
  }

  .hue-choices {
    display: grid;
  }

  button {
    display: grid;
    grid-template-columns: 10px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 4px 8px;
    border-left: 1px solid transparent;
    color: var(--secondary);
    transition: border-color 200ms, color 200ms;
  }

  button[aria-pressed='true'] {
    border-color: var(--swatch);
    color: var(--ink);
  }

  button:hover {
    color: var(--swatch);
  }

  button i {
    width: 8px;
    height: 8px;
    background: var(--swatch);
  }

  .color-labels {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .family-name {
    font-family: var(--font-brand);
    font-size: var(--text-body);
  }

  .family-hex {
    color: var(--secondary);
    font-size: var(--text-small);
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
    .hue-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }

    .hue-wheel {
      max-width: 300px;
    }

    .hue-choices {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px 12px;
    }
  }
</style>
