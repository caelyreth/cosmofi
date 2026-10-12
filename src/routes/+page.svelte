<script lang="ts">
  import { Repeat2 } from 'lucide-svelte'
  import type { Attachment } from 'svelte/attachments'
  import { cubicOut } from 'svelte/easing'
  import { prefersReducedMotion, Tween } from 'svelte/motion'

  import Arrow from '#lib/components/arrow.svelte'
  import DirectionalText from '#lib/components/directional-text.svelte'
  import FamilySelector from '#lib/components/family-selector.svelte'
  import SignalField from '#lib/components/signal-field.svelte'
  import { getPresentation } from '#lib/presentation.svelte'
  import { families } from '#lib/theme'

  const presentation = getPresentation()
  let tunerHovered = $state(false)
  let tunerFocused = $state(false)

  const frequency = Tween.of(() => presentation.channel, {
    duration: () => (prefersReducedMotion.current ? 0 : 550),
    easing: cubicOut,
  })

  const attachCycle: Attachment<HTMLDivElement> = () => {
    let visible = $state(!document.hidden)

    function updateVisibility() {
      visible = !document.hidden
    }

    $effect(() => {
      const nextFamily =
        families[(presentation.channel + 1) % families.length]
      const stopped = [
        presentation.paused,
        !presentation.loopColors,
        !visible,
        tunerHovered,
        tunerFocused,
      ].some(Boolean)

      if (stopped) {
        return
      }

      const timer = setTimeout(
        () => presentation.select(nextFamily.id, 1),
        5500,
      )

      return () => clearTimeout(timer)
    })

    document.addEventListener('visibilitychange', updateVisibility)

    return () => {
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }

  const destinations = [
    { href: '/introduction', label: 'Introduction' },
    { href: '/spectrum', label: 'Spectrum' },
  ]
</script>

<svelte:head>
  <title>Cosmofi — Color from another frequency</title>
  <meta
    name="description"
    content="Cosmic color, lo-fi feeling. Cosmofi Starfield is a color scheme for terminals and code editors, with eight dusty color families and a little room for wonder."
  />
</svelte:head>

<main id="main" class="hero screen" tabindex="-1">
  <div class="hero-stage">
    <div class="hero-image" aria-hidden="true" data-nosnippet>
      <SignalField
        family={presentation.family}
        paused={presentation.paused}
      />
    </div>
    <div class="stage-grid" aria-hidden="true" data-nosnippet></div>
    <div class="hero-title frame">
      <div class="wordmark-line">
        <h1 class="hero-wordmark" id="cosmofi-title">cosmofi</h1>
        <span class="title-period" aria-hidden="true"></span>
      </div>
    </div>
    <div class="hero-copy frame">
      <h2>A little less noise.<br />A lot more <em>space.</em></h2>
      <p>
        A color scheme for terminals, code editors,<br />and the places you
        lose yourself in.
      </p>
      <nav class="hero-destinations" aria-label="Explore Cosmofi">
        {#each destinations as destination}
          <a href={destination.href}>
            <span>{destination.label}</span>
            <Arrow />
          </a>
        {/each}
      </nav>
    </div>
  </div>

  <div
    class="receiver frame"
    role="group"
    aria-label="Atmosphere tuner"
    {@attach attachCycle}
    onpointerenter={() => (tunerHovered = true)}
    onpointerleave={() => (tunerHovered = false)}
    onfocusin={() => (tunerFocused = true)}
    onfocusout={(event) => {
      tunerFocused =
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
    }}
  >
    <div class="receiver-head">
      <div class="receiver-name">
        <span class="instrument-label">Tune the atmosphere</span>
        <strong aria-hidden="true" data-nosnippet>
          <span class="receiver-family-name">
            <DirectionalText
              value={presentation.family.name}
              direction={presentation.direction}
            />
          </span>
          <span class="mono">
            <DirectionalText
              value={presentation.family.foreground}
              direction={presentation.direction}
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
        <label class="sr-only" for="frequency">Select a color family</label>
        <input
          id="frequency"
          type="range"
          min="0"
          max="7"
          step="1"
          bind:value={presentation.channel}
          aria-valuetext={presentation.family.name}
        />
        <span
          class="frequency-marker"
          style:--position={frequency.current / (families.length - 1)}
          aria-hidden="true"
        ></span>
      </div>
      <button
        class="loop-control"
        aria-label={presentation.loopColors
          ? 'Pause color loop'
          : 'Start color loop'}
        aria-pressed={presentation.loopColors}
        title={presentation.loopColors
          ? 'Pause color loop'
          : 'Start color loop'}
        onclick={() => (presentation.loopColors = !presentation.loopColors)}
      >
        <Repeat2 size={15} aria-hidden="true" />
        <span>Color loop</span>
      </button>
    </div>
    <FamilySelector label="Transmission presets" />
    <div class="receiver-foot instrument-label" aria-hidden="true" data-nosnippet>
      <span>Eight families. One atmosphere.</span>
      <span>Cosmofi / Starfield</span>
    </div>
  </div>
</main>

<style>
  .hero {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    padding-top: calc(var(--header-bottom) + 12px);
    padding-bottom: var(--content-bottom);
    background: var(--page);
  }

  .hero-stage {
    position: relative;
    isolation: isolate;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .hero-image {
    position: absolute;
    inset: 8% -2% 0;
    z-index: -2;
    mask-image: linear-gradient(#000 75%, transparent);
    pointer-events: none;
  }

  .stage-grid {
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.16;
    pointer-events: none;
    background-image:
      linear-gradient(var(--secondary) 1px, transparent 1px),
      linear-gradient(90deg, var(--secondary) 1px, transparent 1px),
      linear-gradient(var(--static-muted) 1px, transparent 1px),
      linear-gradient(90deg, var(--static-muted) 1px, transparent 1px);
    background-size:
      160px 160px,
      160px 160px,
      32px 32px,
      32px 32px;
    mask-image: linear-gradient(transparent, #000 65%, transparent);
  }

  .hero-title {
    container-type: inline-size;
  }

  .wordmark-line {
    position: relative;
    width: fit-content;
  }

  h1 {
    width: fit-content;
    font-size: clamp(72px, min(26cqw, 30svh), 350px);
    line-height: 0.88;
    font-weight: 600;
    text-wrap: nowrap;
    view-transition-name: cosmofi-wordmark;
  }

  .title-period {
    position: absolute;
    right: -26px;
    bottom: 8px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--channel);
    transition: background 300ms;
  }

  .hero-copy {
    align-self: end;
    padding-block: 20px 24px;
  }

  .hero-copy h2 {
    font-size: var(--text-heading);
    line-height: 1.05;
  }

  .hero-copy h2 em {
    color: var(--channel);
    font-style: normal;
    transition: color 300ms;
  }

  .hero-copy p {
    margin-top: 12px;
    font-size: var(--text-body);
    line-height: 1.8;
    color: var(--secondary);
  }

  .hero-destinations {
    display: flex;
    gap: 30px;
    margin-top: 14px;
  }

  .hero-destinations a {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    min-height: 44px;
    font-size: var(--text-body);
    text-decoration: none;
  }

  .hero-destinations a:hover {
    color: var(--channel);
  }

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

  @media (max-width: 600px), (max-height: 700px) {
    h1 {
      font-size: clamp(64px, min(27cqw, 21svh), 190px);
    }

    .hero-copy {
      padding-block: 12px;
    }

    .hero-copy h2 {
      font-size: var(--text-title);
    }

    .hero-copy p {
      margin-top: 8px;
      font-size: var(--text-small);
      line-height: 1.6;
    }

    .hero-destinations {
      gap: 20px;
      margin-top: 6px;
    }

    .title-period {
      right: -12px;
      bottom: 3px;
      width: 5px;
      height: 5px;
    }
  }

  @media (max-width: 600px) {
    .hero-image {
      inset: 30px -35% 0;
      opacity: 0.75;
    }

    .hero-destinations {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .hero-destinations a {
      justify-content: space-between;
      gap: 4px;
      font-size: var(--text-small);
    }

    .hero-destinations :global(svg) {
      width: 14px;
    }
  }

  @media (max-height: 500px) {
    .hero-copy p,
    .tuning-scale,
    .receiver-foot {
      display: none;
    }

    h1 {
      font-size: 80px;
    }

    .receiver-head {
      margin-bottom: 0;
    }
  }

  @media (max-height: 400px) {
    .hero-copy h2 {
      display: none;
    }

    .hero-copy {
      padding-block: 4px;
    }

    h1 {
      font-size: 64px;
    }

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
    .hero-copy p,
    .receiver-foot {
      display: none;
    }
  }
</style>
