<script lang="ts">
  import { snapshot } from '$app/navigation'

  import type { LanguageId } from '#lib/introduction/code'
  import CodeSpecimen from '#lib/introduction/code-specimen.svelte'
  import HueStudy from '#lib/introduction/hue-study.svelte'
  import StoryChapter from '#lib/introduction/story-chapter.svelte'
  import SurfaceStudy from '#lib/introduction/surface-study.svelte'
  import { syntaxRoles } from '#lib/introduction/syntax'
  import { getThemeSelection } from '#lib/state/theme.svelte'

  import type { PageProps } from './$types'

  let { data }: PageProps = $props()

  const appearance = getThemeSelection()
  const syntaxColors = $derived(appearance.theme.syntaxColors)
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
  <StoryChapter labelledBy="introduction-title" first>
    {#snippet copy()}
      <span class="chapter-number instrument-label">01 / Color choices</span
      >

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
    {/snippet}

    {#snippet visual()}
      <HueStudy />
    {/snippet}
  </StoryChapter>

  <StoryChapter labelledBy="surface-title">
    {#snippet copy()}
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
            Neither warm nor cool. Every accent sits on the same unbiased
            field, without a tinted surface shifting its appearance.
          </dd>
        </div>
        <div>
          <dt>Depth through brightness</dt>
          <dd>
            Small changes in lightness distinguish the background, working
            surface, and raised planes. The RGB channels remain equal at
            every level.
          </dd>
        </div>
      </dl>
    {/snippet}

    {#snippet visual()}
      <SurfaceStudy />
    {/snippet}
  </StoryChapter>

  <StoryChapter labelledBy="syntax-title" code>
    {#snippet copy()}
      <span class="chapter-number instrument-label">03 / In use</span>

      <div class="chapter-heading">
        <h2 id="syntax-title">Structure<br />at a glance.</h2>
        <p>
          Punctuation stays muted and variables use the normal foreground.
          Color marks the role of a word, keeping the same visual hierarchy
          across four languages.
        </p>
      </div>

      <dl class="syntax-legend">
        {#each syntaxRoles as role (role.id)}
          <div>
            <dt>
              <i style:background={syntaxColors[role.id]} aria-hidden="true"
              ></i>
              <span>{role.label}</span>
            </dt>
            <dd style:color={syntaxColors[role.id]}>{role.family}</dd>
          </div>
        {/each}
      </dl>
    {/snippet}

    {#snippet visual()}
      <CodeSpecimen examples={data.examples} bind:language />
    {/snippet}
  </StoryChapter>
</main>

<style>
  .introduction {
    position: relative;
    overflow-x: hidden;
    background: var(--page);
  }

  @media (min-width: 701px) {
    .introduction {
      background: var(--panel);
    }
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
    border-top: 1px solid var(--line);
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
    border-top: 1px solid var(--line);
  }

  .syntax-legend > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 20px;
    min-height: 40px;
    padding-block: 8px;
    border-bottom: 1px solid var(--line);
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
    .chapter-heading p {
      margin-top: 20px;
    }
  }
</style>
