<script lang="ts">
  import { snapshot } from '$app/navigation'

  import CodeSpecimen from '#lib/components/code-specimen.svelte'
  import HueStudy from '#lib/components/hue-study.svelte'
  import SurfaceStudy from '#lib/components/surface-study.svelte'
  import {
    syntaxColors,
    syntaxRoles,
    type LanguageId,
  } from '#lib/syntax'

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
    content="A deliberate color range, pure grayscale surfaces, and Cosmofi syntax highlighting in TypeScript, C++, Rust, and Swift."
  />
</svelte:head>

<main
  id="main"
  class="introduction screen scroll-pane"
  bind:this={scroller}
  tabindex="-1"
  aria-labelledby="introduction-title"
>
  <section class="chapter split-screen" aria-labelledby="introduction-title">
    <div class="chapter-copy">
      <div class="chapter-writing">
        <span class="chapter-number instrument-label">01 / Color choices</span>

        <div class="chapter-heading">
          <h1 id="introduction-title">A quieter<br />color range.</h1>
          <p>
            Cyan and blue are deliberately absent. Softened violet, rose,
            green, and earth tones leave a clear gap in the hue circle,
            keeping the palette restrained during long reading sessions.
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
            <dt>Accents and neutrals</dt>
            <dd>
              Six chromatic accents carry structure. Static and Moonveil
              provide the quiet neutral range around them.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="chapter-visual">
      <div class="visual-content">
        <HueStudy />
      </div>
    </div>
  </section>

  <section class="chapter split-screen" aria-labelledby="surface-title">
    <div class="chapter-copy">
      <div class="chapter-writing">
        <span class="chapter-number instrument-label">02 / Surfaces</span>

        <div class="chapter-heading">
          <h2 id="surface-title">Pure grayscale<br />surfaces.</h2>
          <p>
            Equal red, green, and blue values keep the interface neutral.
            Depth comes from brightness and spacing, while the surrounding
            field leaves the color of your content alone.
          </p>
        </div>

        <dl class="principles">
          <div>
            <dt>No color cast</dt>
            <dd>
              Neither warm nor cool. Every accent sits on the same
              unbiased field, without a tinted surface shifting its
              appearance.
            </dd>
          </div>
          <div>
            <dt>Depth through brightness</dt>
            <dd>
              Small changes in lightness distinguish the background,
              working surface, and raised planes. The RGB channels remain
              equal at every level.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="chapter-visual">
      <div class="visual-content">
        <SurfaceStudy />
      </div>
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
      <div class="visual-content code-content">
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
    margin: 0 auto;
  }

  .chapter-writing {
    max-width: 440px;
  }

  .visual-content {
    max-width: 720px;
  }

  .code-content {
    max-width: 780px;
  }

  .chapter-number {
    color: var(--secondary);
  }

  h1,
  h2 {
    font-size: var(--text-display);
    line-height: 1.05;
  }

  .chapter-heading p {
    max-width: 38ch;
    margin-top: 24px;
    color: var(--secondary);
    font-size: var(--text-body);
    line-height: 1.8;
  }

  .principles,
  .syntax-legend {
    margin: 0;
  }

  .principles {
    display: grid;
    gap: 24px;
    padding-top: 24px;
    border-top: 1px solid #333333;
  }

  .principles dt {
    font-size: var(--text-body);
    font-weight: 600;
  }

  .principles dd {
    max-width: 42ch;
    margin: 8px 0 0;
    color: var(--secondary);
    font-size: var(--text-small);
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
    gap: 12px 20px;
    min-height: 40px;
    padding-block: 8px;
    border-bottom: 1px solid #292929;
    font-size: var(--text-small);
  }

  .syntax-legend dt {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .syntax-legend i {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  .syntax-legend dd {
    margin: 0;
    font-family: var(--font-brand);
  }

  @media (max-width: 1100px) {
    h1,
    h2 {
      font-size: var(--text-heading);
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

    .chapter:not(:first-child) .chapter-copy {
      padding-top: 36px;
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

    .chapter-heading p {
      margin-top: 20px;
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
