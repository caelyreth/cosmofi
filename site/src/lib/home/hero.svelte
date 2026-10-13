<script lang="ts">
  import { resolve } from '$app/paths'
  import type { Family } from 'cosmofi'

  import Arrow from '#lib/components/arrow.svelte'
  import { getThemeSelection } from '#lib/state/theme.svelte'

  import SignalField from './signal-field.svelte'

  interface Props {
    family: Family
    paused: boolean
  }

  let { family, paused }: Props = $props()

  const appearance = getThemeSelection()

  const destinations = [
    { href: resolve('/introduction'), label: 'Introduction' },
    { href: resolve('/spectrum'), label: 'Spectrum' },
  ] as const
</script>

<div class="hero-stage">
  <div class="hero-image" aria-hidden="true" data-nosnippet>
    <SignalField {family} {paused} theme={appearance.theme} />
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

<style>
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
  }

  :global(:root[data-route-transition]) h1 {
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
    .hero-copy p {
      display: none;
    }

    h1 {
      font-size: 80px;
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
  }

  @media (max-width: 900px) and (max-height: 600px) {
    .hero-copy p {
      display: none;
    }
  }
</style>
