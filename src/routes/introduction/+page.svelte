<script lang="ts">
  import { snapshot } from '$app/navigation'

  import CodeSpecimen from '#lib/components/code-specimen.svelte'
  import {
    syntaxColors,
    syntaxRoles,
    type LanguageId,
  } from '#lib/syntax'
  import { base, families } from '#lib/theme'

  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let scroller = $state<HTMLElement>()
  let restoredScroll = $state<number>()
  let language = $state<LanguageId>('ts')

  snapshot({
    id: 'cosmofi-introduction',
    capture: () => ({ scrollTop: scroller?.scrollTop ?? 0, language }),
    restore: (saved) => {
      language = saved.language
      restoredScroll = saved.scrollTop
    },
    reset: () => {
      language = 'ts'
      restoredScroll = 0
    },
  })

  $effect(() => {
    if (scroller && restoredScroll !== undefined) {
      scroller.scrollTo({ top: restoredScroll, behavior: 'instant' })
    }
  })
</script>

<svelte:head>
  <title>Introduction - Cosmofi Starfield</title>
  <meta
    name="description"
    content="Pure grayscale surfaces, a deliberate color range, and Cosmofi syntax highlighting in TypeScript, C++, Rust, and Swift."
  />
</svelte:head>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (The introduction is the route's native scroll container.) -->
<main
  id="main"
  class="introduction screen scroll-pane"
  bind:this={scroller}
  tabindex="0"
  aria-labelledby="introduction-title"
>
  <section class="chapter split-screen" aria-labelledby="introduction-title">
    <div class="chapter-copy">
      <div class="chapter-writing">
        <span class="chapter-number instrument-label">01 / Surfaces</span>

        <div class="chapter-heading">
          <h1 id="introduction-title">Pure grayscale<br />surfaces.</h1>
          <p>
            The interface begins with equal red, green, and blue values.
            A neutral background keeps color out of the surroundings and
            attention on the content.
          </p>
        </div>

        <dl class="principles">
          <div>
            <dt>No color cast</dt>
            <dd>
              Neither warm nor cool. Accents sit on the same unbiased
              field, without a tinted surface shifting their appearance.
            </dd>
          </div>
          <div>
            <dt>Depth through brightness</dt>
            <dd>
              Small changes in lightness separate the background from
              working surfaces. No grain, tint, or overlay is added.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="chapter-visual">
      <figure class="visual-content neutral-study">
        <figcaption class="figure-heading instrument-label">
          <span>Surface composition</span>
          <span>R = G = B</span>
        </figcaption>

        <div
          class="neutral-composition"
          role="img"
          aria-label="Overlapping grayscale planes show depth through brightness, with no hue in any surface."
        >
          <span class="plane-ground"></span>
          <span class="plane-raised"></span>
          <span class="plane-recess"></span>
          <span class="plane-outline"></span>
          <span class="plane-axis"></span>
          <span class="plane-label instrument-label">Neutral field</span>
        </div>

        <dl class="surface-register">
          <div>
            <dt>Background</dt>
            <dd class="mono">{base.background}</dd>
          </div>
          <div>
            <dt>Working surface</dt>
            <dd class="mono">#1A1A1A</dd>
          </div>
        </dl>

        <div class="channel-register" aria-label="Background RGB channels">
          {#each ['R', 'G', 'B'] as channel}
            <div>
              <span class="instrument-label">{channel}</span>
              <span class="channel-track" aria-hidden="true"></span>
              <span class="mono">22</span>
            </div>
          {/each}
        </div>
      </figure>
    </div>
  </section>

  <section class="chapter split-screen" aria-labelledby="color-title">
    <div class="chapter-copy">
      <div class="chapter-writing">
        <span class="chapter-number instrument-label">02 / Color choices</span>

        <div class="chapter-heading">
          <h2 id="color-title">A quieter<br />color range.</h2>
          <p>
            Cyan and blue are deliberately absent. The palette uses
            softened violet, rose, green, and earth tones to keep visual
            intensity low during long reading sessions.
          </p>
        </div>

        <dl class="principles">
          <div>
            <dt>Less competition</dt>
            <dd>
              Fewer hue families compete for attention. Color separates
              meaningful details instead of filling every part of the view.
            </dd>
          </div>
          <div>
            <dt>Restrained accents</dt>
            <dd>
              Each family keeps a measured foreground and a stronger
              emphasis. Neutrals carry the rest of the reading hierarchy.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="chapter-visual">
      <figure class="visual-content chroma-study">
        <figcaption class="figure-heading instrument-label">
          <span>Selected color range</span>
          <span>Eight families</span>
        </figcaption>

        <div
          class="chroma-rail"
          role="img"
          aria-label="The eight Cosmofi foreground colors: Static, Halo, Afterglow, Remnant, Unripe, Life, Regolith, and Moonveil."
        >
          {#each families as family (family.id)}
            <span
              style:background={family.foreground}
              title={family.name}
            ></span>
          {/each}
        </div>

        <div class="chroma-key">
          {#each families as family (family.id)}
            <div>
              <i style:background={family.foreground} aria-hidden="true"></i>
              <span>{family.name}</span>
            </div>
          {/each}
        </div>

        <div class="omitted-range">
          {#each ['Cyan', 'Blue'] as name}
            <div>
              <div class="range-label">
                <span>{name}</span>
                <span class="instrument-label">Omitted</span>
              </div>
              <span class="empty-range" aria-hidden="true"></span>
            </div>
          {/each}
        </div>

        <p class="figure-note">
          A deliberate gap in the palette. Color is reserved for structure,
          with a neutral field around it.
        </p>
      </figure>
    </div>
  </section>

  <section class="chapter split-screen" aria-labelledby="syntax-title">
    <div class="chapter-copy">
      <div class="chapter-writing">
        <span class="chapter-number instrument-label">03 / In use</span>

        <div class="chapter-heading">
          <h2 id="syntax-title">Structure<br />at a glance.</h2>
          <p>
            Punctuation stays muted and variables use the normal
            foreground. Color marks the role of a word, keeping the same
            visual hierarchy across four languages.
          </p>
        </div>

        <dl class="syntax-legend">
          {#each syntaxRoles as role (role.id)}
            <div>
              <dt>
                <i
                  style:background={syntaxColors[role.id]}
                  aria-hidden="true"
                ></i>
                <span>{role.label}</span>
              </dt>
              <dd style:color={syntaxColors[role.id]}>{role.family}</dd>
            </div>
          {/each}
        </dl>
      </div>
    </div>

    <div class="chapter-visual">
      <div class="visual-content">
        <CodeSpecimen examples={data.examples} bind:language />
      </div>
    </div>
  </section>
</main>

<style>
  .introduction {
    position: relative;
    overflow-x: hidden;
    background: var(--page);
  }

  .chapter {
    min-height: 100%;
    border-bottom: 1px solid #2D2D2D;
  }

  .chapter:last-child {
    border-bottom: 0;
  }

  .chapter-copy,
  .chapter-visual {
    display: flex;
    align-items: center;
    min-width: 0;
    padding: var(--content-top) var(--page-inset) var(--content-bottom);
  }

  .chapter-copy {
    background: var(--page);
  }

  .chapter-visual {
    background: var(--panel);
  }

  .chapter-writing,
  .visual-content {
    display: flex;
    flex-direction: column;
    gap: 28px;
    width: 100%;
    min-width: 0;
    margin: 0;
  }

  .chapter-writing {
    max-width: 440px;
    margin-inline: auto;
  }

  .visual-content {
    max-width: 780px;
    margin-inline: auto;
  }

  .chapter-number {
    color: var(--secondary);
  }

  h1,
  h2 {
    font-size: 56px;
    line-height: 1.02;
  }

  .chapter-heading p {
    max-width: 38ch;
    margin-top: 24px;
    color: var(--secondary);
    font-size: 13px;
    line-height: 1.85;
  }

  .principles,
  .surface-register,
  .syntax-legend {
    margin: 0;
  }

  .principles {
    display: grid;
    gap: 22px;
    padding-top: 24px;
    border-top: 1px solid #333333;
  }

  .principles dt {
    font-size: 12px;
    font-weight: 600;
  }

  .principles dd {
    max-width: 42ch;
    margin: 8px 0 0;
    color: var(--secondary);
    font-size: 11px;
    line-height: 1.85;
  }

  .figure-heading {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    color: var(--secondary);
  }

  .neutral-composition {
    position: relative;
    width: 100%;
    height: clamp(230px, 42svh, 390px);
    overflow: hidden;
    color: #929292;
  }

  .plane-ground,
  .plane-raised,
  .plane-recess,
  .plane-outline,
  .plane-axis {
    position: absolute;
  }

  .plane-ground {
    inset: 0;
    background: var(--page);
  }

  .plane-raised {
    top: 12%;
    left: 24%;
    width: 64%;
    height: 68%;
    background: #242424;
  }

  .plane-recess {
    bottom: 0;
    left: 10%;
    width: 38%;
    height: 58%;
    background: var(--panel);
  }

  .plane-outline {
    right: 4%;
    bottom: 8%;
    width: 36%;
    height: 44%;
    border: 1px solid #545454;
  }

  .plane-axis {
    top: 0;
    bottom: 0;
    left: 64%;
    width: 1px;
    background: #3A3A3A;
  }

  .plane-label {
    position: absolute;
    left: 20px;
    bottom: 20px;
    font-size: 8px;
  }

  .surface-register {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .surface-register > div {
    display: grid;
    gap: 10px;
  }

  .surface-register dt {
    color: var(--secondary);
    font-size: 11px;
  }

  .surface-register dd {
    margin: 0;
    font-size: 12px;
  }

  .channel-register {
    display: grid;
    gap: 12px;
    padding-top: 24px;
    border-top: 1px solid #333333;
    color: var(--secondary);
  }

  .channel-register > div {
    display: grid;
    grid-template-columns: 16px minmax(0, 1fr) 24px;
    align-items: center;
    gap: 16px;
  }

  .channel-register .mono {
    font-size: 9px;
    text-align: right;
  }

  .channel-track {
    position: relative;
    height: 2px;
    background: #2D2D2D;
  }

  .channel-track::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: calc(100% * 22 / 255);
    background: #929292;
  }

  .chroma-rail {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 3px;
    height: clamp(150px, 28svh, 250px);
  }

  .chroma-key {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px 20px;
  }

  .chroma-key > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
  }

  .chroma-key i,
  .syntax-legend i {
    display: block;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  .omitted-range {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    padding-top: 24px;
    border-top: 1px solid #333333;
  }

  .range-label {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    color: var(--secondary);
    font-size: 11px;
  }

  .range-label .instrument-label {
    font-size: 8px;
  }

  .empty-range {
    display: block;
    height: 64px;
    margin-top: 16px;
    border: 1px dashed #404040;
  }

  .figure-note {
    max-width: 54ch;
    color: var(--secondary);
    font-size: 11px;
    line-height: 1.8;
  }

  .syntax-legend {
    border-top: 1px solid #333333;
  }

  .syntax-legend > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 20px;
    min-height: 38px;
    padding-block: 8px;
    border-bottom: 1px solid #292929;
    font-size: 11px;
  }

  .syntax-legend dt {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .syntax-legend dd {
    margin: 0;
    font-size: 10px;
  }

  @media (max-width: 1100px) {
    h1,
    h2 {
      font-size: 44px;
    }

    .chroma-key {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 700px) {
    .chapter {
      grid-template-columns: minmax(0, 1fr);
      min-height: auto;
    }

    .chapter-copy {
      padding-bottom: 32px;
    }

    .chapter-visual {
      padding-top: 28px;
      padding-bottom: 36px;
    }

    .chapter-writing,
    .visual-content {
      max-width: 540px;
      gap: 24px;
    }

    h1,
    h2 {
      font-size: 40px;
    }

    .chapter-heading p {
      margin-top: 20px;
    }

    .neutral-composition {
      height: 260px;
    }

    .chroma-rail {
      height: 150px;
    }
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .chapter {
        view-timeline-name: --chapter;
        view-timeline-axis: block;
      }

      .chapter:not(:first-child) .chapter-writing,
      .chapter:not(:first-child) .visual-content {
        animation: chapter-enter linear both;
        animation-timeline: --chapter;
        animation-range: entry 0% entry 85%;
      }
    }
  }

  @keyframes chapter-enter {
    from {
      opacity: 0.45;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
