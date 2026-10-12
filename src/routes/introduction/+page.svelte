<script lang="ts">
  import { snapshot } from '$app/navigation'

  import FamilySelector from '#lib/components/family-selector.svelte'
  import SignalScope from '#lib/components/signal-scope.svelte'
  import Workspace from '#lib/components/workspace.svelte'
  import { getPresentation } from '#lib/presentation.svelte.js'
  import { families, roles } from '#lib/theme.js'

  const presentation = getPresentation()
  let view = $state<'origin' | 'workspace'>('origin')

  snapshot({
    id: 'cosmofi-introduction-view',
    capture: () => view,
    restore: (restoredView) => {
      view = restoredView
    },
    reset: () => {
      view = 'origin'
    },
  })
</script>

<svelte:head>
  <title>Introduction — Cosmofi Starfield</title>
  <meta
    name="description"
    content="Cosmic color, lo-fi feeling. The story behind Cosmofi Starfield and a live code specimen in eight color families."
  />
</svelte:head>

<main id="main" class="introduction screen">
  <div class="view-tabs" role="radiogroup" aria-label="Introduction view">
    <label>
      <input
        type="radio"
        name="introduction-view"
        value="origin"
        bind:group={view}
      />
      <span>Origin</span>
    </label>
    <label>
      <input
        type="radio"
        name="introduction-view"
        value="workspace"
        bind:group={view}
      />
      <span>In use</span>
    </label>
  </div>

  {#if view === 'origin'}
    <section class="origin view split-screen" aria-labelledby="origin-title">
      <div class="origin-narrative">
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (The story pane accepts keyboard scrolling on compact screens.) -->
        <div
          class="origin-writing scroll-pane"
          tabindex="0"
          role="region"
          aria-labelledby="origin-title"
        >
          <h1 id="origin-title">Far out.<br /><span>Tuned in.</span></h1>
          <p class="origin-intro">
            A little of the distant. A little of the familiar. Cosmofi
            brings the two into the same room.
          </p>
          <div class="name-story">
            <div>
              <h2>cosmic</h2>
              <p>
                Distant light. Mineral dust. Violet at the edge of an orbit.
              </p>
            </div>
            <div>
              <h2>lo-fi</h2>
              <p>
                Charcoal, softened whites, and dusty accents. A familiar
                warmth for the screen you return to.
              </p>
            </div>
          </div>
          <p class="origin-note">
            Cosmic + lo-fi.<br />Made for the hours between.
          </p>
        </div>
      </div>
      <div class="origin-visual">
        <div class="origin-visual-top instrument-label">
          <span>Cosmofi / Starfield</span>
          <span>Two worlds. One frequency.</span>
        </div>
        <div class="origin-equation" aria-label="Cosmic times lo-fi">
          <span class="cosmic-word">cosmic</span>
          <span class="multiply" aria-hidden="true">×</span>
          <span class="lofi-word">lo-fi</span>
        </div>
        <SignalScope
          channel={presentation.channel}
          mix={24}
          paused={presentation.paused}
        />
        <div class="origin-visual-foot">
          <p>Distant hues.<br />Everyday company.</p>
          <div aria-hidden="true">
            {#each families as family}
              <i style:background={family.foreground}></i>
            {/each}
          </div>
        </div>
      </div>
    </section>
  {:else}
    <section
      class="workspace-layout view split-screen"
      aria-labelledby="workspace-title"
    >
      <div class="workspace-intro">
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (The preview controls accept keyboard scrolling on compact screens.) -->
        <div
          class="workspace-writing scroll-pane"
          tabindex="0"
          role="region"
          aria-labelledby="workspace-title"
        >
        <h1 id="workspace-title">
          A familiar place.<br /><span>A different atmosphere.</span>
        </h1>
        <p>
          From the first idea to the last line of code. See Starfield where
          your ideas take shape.
        </p>
        <FamilySelector label="Workspace color family" />
        <div class="workspace-family">
          <h2>{presentation.family.name}</h2>
          <span class="mono">{presentation.family.foreground}</span>
        </div>
        <dl class="workspace-values">
          {#each roles as role}
            <div>
              <dt>{role}</dt>
              <dd class="mono">{presentation.family[role]}</dd>
            </div>
          {/each}
        </dl>
        <p class="workspace-disclosure">
          Illustrative syntax mapping. Your editor, another atmosphere.
        </p>
        </div>
      </div>
      <Workspace family={presentation.family} />
    </section>
  {/if}
</main>

<style>
  .introduction {
    display: grid;
    position: relative;
    grid-template-rows: minmax(0, 1fr);
  }

  .view-tabs {
    position: absolute;
    top: var(--header-top);
    left: calc(var(--page-inset) + 168px);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 20px;
    height: 44px;
  }

  .view-tabs label {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 44px;
    font-size: 12px;
    color: var(--secondary);
    cursor: pointer;
  }

  .view-tabs input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .view-tabs input:checked + span {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 8px;
  }

  .view-tabs input:focus-visible + span {
    outline: 2px solid var(--halo-foreground);
    outline-offset: 6px;
  }

  .view {
    min-height: 0;
    min-width: 0;
    animation: view-enter 220ms ease-out;
  }

  .origin-narrative {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    min-width: 0;
    min-height: 0;
    padding: var(--content-top) var(--page-inset) var(--content-bottom);
  }

  .origin-writing {
    width: 100%;
    min-width: 0;
    height: 100%;
    max-width: 550px;
    align-content: safe center;
  }

  h1 {
    font-size: 64px;
    line-height: 0.97;
  }

  .origin-narrative h1 span {
    color: var(--regolith-foreground);
  }

  .origin-intro {
    max-width: 36ch;
    font-size: 15px;
    line-height: 1.85;
    margin-top: 24px;
  }

  .name-story {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--static-muted);
  }

  .name-story h2 {
    font-size: 32px;
  }

  .name-story > div:first-child h2 {
    color: var(--halo-foreground);
  }

  .name-story > div:last-child h2 {
    color: var(--regolith-foreground);
  }

  .name-story p {
    margin-top: 12px;
    font-size: 12px;
    line-height: 1.85;
    color: var(--secondary);
  }

  .origin-note {
    margin-top: 24px;
    font-size: 12px;
    line-height: 1.8;
    color: var(--secondary);
  }

  .origin-visual {
    display: flex;
    container-type: inline-size;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    padding: var(--header-top) var(--page-inset) var(--content-bottom);
    overflow: hidden;
    background: var(--regolith-foreground);
    color: var(--page);
  }

  .origin-visual-top {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    font-size: 8px;
  }

  .origin-equation {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block: 24px;
    font:
      500 clamp(64px, 17cqw, 150px)/0.88 'Bricolage',
      sans-serif;
  }

  .cosmic-word {
    align-self: flex-start;
  }

  .multiply {
    align-self: center;
    font-size: 0.45em;
    margin-block: 8px;
  }

  .lofi-word {
    align-self: flex-end;
  }

  .origin-visual-foot {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-top: 24px;
  }

  .origin-visual-foot p {
    font:
      500 28px/1.05 'Bricolage',
      sans-serif;
  }

  .origin-visual-foot > div {
    display: flex;
    gap: 3px;
  }

  .origin-visual-foot i {
    width: 10px;
    height: 20px;
  }

  .workspace-intro {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    min-width: 0;
    min-height: 0;
    padding: var(--content-top) var(--page-inset) var(--content-bottom);
  }

  .workspace-writing {
    display: flex;
    flex-direction: column;
    justify-content: safe center;
    gap: 24px;
  }

  .workspace-writing > * {
    flex-shrink: 0;
  }

  .workspace-intro h1 {
    font-size: 44px;
  }

  .workspace-intro h1 span {
    color: var(--halo-foreground);
  }

  .workspace-writing > p {
    font-size: 13px;
    line-height: 1.85;
    max-width: 40ch;
  }

  .workspace-intro :global(.family-selector) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 12px;
  }

  .workspace-family {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    color: var(--channel);
  }

  .workspace-family h2 {
    font-size: 27px;
  }

  .workspace-family > span {
    font-size: 12px;
  }

  .workspace-values {
    display: grid;
    margin: 0;
  }

  .workspace-values > div {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    border-top: 1px solid var(--static-muted);
    padding-block: 9px;
    font-size: 12px;
  }

  .workspace-values dt,
  .workspace-disclosure {
    color: var(--secondary);
  }

  .workspace-values dd {
    margin: 0;
  }

  @keyframes view-enter {
    from {
      opacity: 0;
    }
  }

  @media (max-width: 1100px), (max-height: 700px) {
    h1 {
      font-size: 48px;
    }

    .origin-intro {
      font-size: 13px;
      margin-top: 18px;
    }

    .name-story {
      gap: 20px;
      margin-top: 20px;
    }

    .origin-note {
      margin-top: 20px;
    }

    .workspace-intro h1 {
      font-size: 36px;
    }

    .workspace-writing {
      gap: 16px;
    }
  }

  @media (max-height: 700px) {
    .origin-equation {
      font-size: 80px;
      padding-block: 12px;
    }

    .origin-visual-top {
      display: none;
    }

    .origin-visual :global(svg) {
      height: 80px;
    }

    .origin-visual-foot p {
      font-size: 20px;
    }
  }

  @media (max-width: 900px) {
    .view-tabs {
      left: auto;
      right: var(--page-inset);
    }

    .origin {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) minmax(160px, 30%);
    }

    h1 {
      font-size: 40px;
    }

    .origin-equation {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-block: 0;
      font-size: 40px;
    }

    .cosmic-word,
    .lofi-word,
    .multiply {
      align-self: center;
    }

    .multiply {
      margin: 0;
    }

    .origin-visual-top,
    .origin-visual-foot {
      display: none;
    }

    .origin-visual :global(svg) {
      height: 40px;
    }

    .origin-visual :global(.scope-top) {
      margin-bottom: 6px;
    }

    .origin-visual :global(.scope-bottom) {
      margin-top: 6px;
    }

    .workspace-layout {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) minmax(180px, 42%);
    }

    .workspace-intro h1 {
      font-size: 30px;
    }
  }

  @media (max-height: 500px) {
    .origin {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: minmax(0, 1fr);
    }

    .origin-equation {
      flex-direction: column;
      font-size: 44px;
    }

    .workspace-layout {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: minmax(0, 1fr);
    }

    .origin-visual :global(.scope),
    .origin-visual-foot {
      display: none;
    }
  }

  @media (max-height: 500px) and (min-width: 601px) {
    .view-tabs {
      left: calc(var(--page-inset) + 168px);
      right: auto;
    }
  }

  @media (max-height: 500px) and (max-width: 600px) {
    .origin {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) 120px;
    }

    .origin-equation {
      flex-direction: row;
      font-size: 36px;
    }

    .workspace-layout {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) minmax(96px, 45%);
    }
  }
</style>
