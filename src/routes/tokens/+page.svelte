<script lang="ts">
  import { snapshot } from '$app/navigation'
  import { Download } from 'lucide-svelte'
  import type { Attachment } from 'svelte/attachments'
  import { prefersReducedMotion } from 'svelte/motion'

  import ColorCopy from '#lib/components/color-copy.svelte'
  import ColorFormatSelector from '#lib/components/color-format-selector.svelte'
  import { getPresentation } from '#lib/presentation.svelte.js'
  import {
    cssExport,
    tokenGroups,
    tokensByGroup,
    type TokenGroupId,
  } from '#lib/theme.js'

  const presentation = getPresentation()
  let pane: HTMLDivElement | undefined
  let active = $state<TokenGroupId>('base')
  let restoredPaneScroll = $state<number | undefined>()
  let scrollInset = $state(76)

  snapshot({
    id: 'cosmofi-token-register',
    capture: () => ({ active, paneScrollTop: pane?.scrollTop ?? 0 }),
    restore: ({ active: restoredActive, paneScrollTop }) => {
      active = restoredActive
      restoredPaneScroll = paneScrollTop
    },
    reset: () => {
      active = 'base'
      restoredPaneScroll = undefined
    },
  })

  function go(id: TokenGroupId) {
    const element = pane?.querySelector<HTMLElement>(`#group-${id}`)
    if (!pane || !element) {
      return
    }

    pane.scrollTo({
      top: element.offsetTop - scrollInset,
      behavior: prefersReducedMotion.current ? 'instant' : 'smooth',
    })
  }

  const attachTokenScroll: Attachment<HTMLDivElement> = (element) => {
    pane = element
    const sections = [
      ...element.querySelectorAll<HTMLElement>('.token-group'),
    ]
    const heading = element.querySelector<HTMLElement>('.table-heading')
    const content = element.querySelector<HTMLElement>('.token-groups')
    let offsets: number[] = []
    let trackingFrame = 0

    function track() {
      trackingFrame = 0
      if (
        element.scrollTop + element.clientHeight >=
        element.scrollHeight - 1
      ) {
        active = tokenGroups.at(-1)!.id
        return
      }

      const threshold = element.scrollTop + scrollInset + 16
      const index = offsets.findLastIndex((offset) => offset <= threshold)
      active = tokenGroups[Math.max(0, index)].id
    }

    function scheduleTrack() {
      if (!trackingFrame) {
        trackingFrame = requestAnimationFrame(track)
      }
    }

    function measure() {
      scrollInset = heading?.offsetHeight ?? 76
      offsets = sections.map((section) => section.offsetTop)
      scheduleTrack()
    }

    const resize = new ResizeObserver(measure)
    resize.observe(element)
    if (heading) {
      resize.observe(heading)
    }
    if (content) {
      resize.observe(content)
    }

    element.addEventListener('scroll', scheduleTrack, { passive: true })
    measure()

    $effect(() => {
      if (restoredPaneScroll !== undefined) {
        element.scrollTo({ top: restoredPaneScroll, behavior: 'instant' })
      }
    })

    return () => {
      resize.disconnect()
      element.removeEventListener('scroll', scheduleTrack)
      cancelAnimationFrame(trackingFrame)
      pane = undefined
    }
  }
</script>

<svelte:head>
  <title>Color tokens — Cosmofi Starfield</title>
  <meta
    name="description"
    content="The complete Cosmofi Starfield reference: 36 semantic color tokens, 33 unique colors, copyable hexadecimal and RGB values, and a CSS export."
  />
</svelte:head>

<main id="main" class="reference-page screen split-screen">
  <aside class="reference-intro">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (The family index accepts keyboard scrolling on short screens.) -->
    <div
      class="reference-writing scroll-pane"
      tabindex="0"
      role="region"
      aria-labelledby="reference-title"
    >
      <div>
        <h1 id="reference-title">The whole <br /><span>spectrum.</span></h1>
        <p class="intro-copy">
          Starfield, down to the last value.<br />Find your own frequency.
        </p>
      </div>
      <div class="reference-stats">
        <div>
          <strong>36</strong>
          <span class="instrument-label">Semantic tokens</span>
        </div>
        <div>
          <strong>33</strong>
          <span class="instrument-label">Unique colors</span>
        </div>
      </div>
      <div class="reference-note">
        <p>
          Surface, muted, foreground, and emphasis are inferred swatch
          roles. Editor syntax and terminal ANSI assignments are not defined
          here.
        </p>
        <a
          class="solid-link"
          href={`data:text/css;charset=utf-8,${encodeURIComponent(cssExport)}`}
          download="cosmofi-starfield.css"
          title="Download CSS"
          aria-label="Download Cosmofi Starfield CSS"
        >
          <Download size={16} aria-hidden="true" />
          <span>Download CSS</span>
        </a>
      </div>
    </div>
  </aside>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex (The reference pane accepts native keyboard scrolling.) -->
  <div
    class="token-scroll scroll-pane"
    {@attach attachTokenScroll}
    style:--table-inset={`${scrollInset}px`}
    tabindex="0"
    role="region"
    aria-label="Complete semantic color token table"
  >
    <div class="table-heading">
      <nav class="family-index" aria-label="Jump to color family">
        {#each tokenGroups as group}
          <button
            class:active={active === group.id}
            aria-current={active === group.id ? 'location' : undefined}
            aria-label={`Show ${group.name} tokens`}
            title={group.name}
            onclick={() => go(group.id)}
            style:--family={group.foreground}
          >
            <span class="family-strip" aria-hidden="true"></span>
          </button>
        {/each}
      </nav>
      <div class="table-tools">
        <span>Semantic color register</span>
        <ColorFormatSelector bind:value={presentation.colorFormat} />
      </div>
    </div>
    <div class="token-groups">
      {#each tokenGroups as group (group.id)}
        <section
          class="token-group"
          id={`group-${group.id}`}
          aria-labelledby={`title-${group.id}`}
          style:--family={group.foreground}
        >
          <div class="group-intro">
            <h2 id={`title-${group.id}`}>{group.name}</h2>
            <p>{group.description}</p>
          </div>
          <table>
            <caption class="sr-only">{group.name} color tokens</caption>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col"
                  >{presentation.colorFormat.toUpperCase()} value</th
                >
              </tr>
            </thead>
            <tbody>
              {#each tokensByGroup[group.id] as token (token.name)}
                <tr>
                  <th scope="row">
                    <span class="token-label">
                      <span
                        class="swatch"
                        style:background={token.value}
                        aria-hidden="true"
                      ></span>
                      <code>{token.name}</code>
                    </span>
                  </th>
                  <td>
                    <ColorCopy
                      color={token.value}
                      format={presentation.colorFormat}
                      name={token.name}
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </section>
      {/each}
    </div>
  </div>
</main>

<style>
  .reference-intro {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    min-width: 0;
    min-height: 0;
    padding: var(--content-top) var(--page-inset) var(--content-bottom);
  }

  .reference-writing {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .reference-writing > * {
    flex-shrink: 0;
  }

  h1 {
    font-size: 64px;
    line-height: 0.97;
  }

  h1 span {
    color: var(--regolith-foreground);
  }

  .intro-copy {
    margin-top: 20px;
    color: var(--secondary);
    font-size: 13px;
    line-height: 1.8;
  }

  .reference-stats {
    display: flex;
    gap: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--static-muted);
  }

  .reference-stats > div {
    display: grid;
    gap: 8px;
  }

  .reference-stats strong {
    font:
      500 32px/1 'Bricolage',
      sans-serif;
  }

  .reference-stats span {
    color: var(--secondary);
    font-size: 8px;
  }

  .reference-note p {
    max-width: 40ch;
    font-size: 11px;
    line-height: 1.9;
    color: var(--secondary);
  }

  .solid-link {
    margin-top: 20px;
    font-size: 12px;
    gap: 24px;
  }

  .token-scroll {
    position: relative;
    background: var(--panel);
    scroll-padding-top: var(--table-inset);
    padding-bottom: var(--content-bottom);
  }

  .table-heading {
    position: sticky;
    top: 0;
    z-index: 9;
    display: grid;
    gap: 12px;
    min-height: var(--content-top);
    padding: var(--header-top) var(--page-inset) var(--edge-inset);
    background: var(--panel);
    color: var(--secondary);
    font-size: 12px;
  }

  .table-tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .family-index {
    display: grid;
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 6px;
  }

  .family-index button {
    position: relative;
    min-width: 0;
    height: 32px;
    padding: 4px 0 12px;
    border: 0;
    background: transparent;
  }

  .family-strip {
    display: block;
    height: 12px;
    background: var(--family);
    opacity: 0.65;
    transition: opacity 180ms;
  }

  .family-index button::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 2px;
    background: var(--family);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 250ms ease-out;
  }

  .family-index .active::after {
    transform: scaleX(1);
  }

  .family-index .active .family-strip,
  .family-index button:hover .family-strip {
    opacity: 1;
  }

  .token-groups {
    padding-inline: var(--page-inset);
  }

  .token-group {
    padding-block: 24px;
    border-top: 1px solid var(--static-muted);
  }

  .token-group:last-child {
    padding-bottom: 0;
  }

  .group-intro {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 22px;
  }

  h2 {
    font-size: 32px;
    color: var(--family);
  }

  .group-intro p {
    font-size: 11px;
    line-height: 1.7;
    color: var(--secondary);
    max-width: 31ch;
    text-align: right;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
  }

  thead th {
    color: var(--secondary);
    font-size: 10px;
    font-weight: 400;
    text-align: left;
    padding: 0 8px 12px;
  }

  thead th:first-child {
    width: 50%;
    padding-left: 0;
  }

  thead th:nth-child(2) {
    width: 50%;
  }

  tbody th {
    font-weight: 400;
    text-align: left;
    padding: 10px 8px 10px 0;
  }

  td {
    padding: 0;
  }

  td :global(.copy-button) {
    min-height: 64px;
    padding: 10px 8px;
  }

  tbody tr + tr {
    border-top: 1px solid
      color-mix(in srgb, var(--static-muted) 35%, transparent);
  }

  .token-label {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .swatch {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 2px;
  }

  code {
    font:
      11px/1.65 'Martian Mono',
      monospace;
    overflow-wrap: anywhere;
  }

  @media (max-width: 1100px), (max-height: 700px) {
    h1 {
      font-size: 48px;
    }

    .group-intro {
      align-items: flex-start;
      flex-direction: column;
      gap: 6px;
    }

    .group-intro p {
      text-align: left;
      max-width: none;
    }
  }

  @media (max-width: 900px) {
    .reference-page {
      grid-template-columns: 1fr;
      grid-template-rows: auto minmax(0, 1fr);
    }

    .reference-intro {
      display: block;
      padding: var(--content-top) var(--page-inset) var(--edge-inset);
    }

    .reference-writing {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px 16px;
      overflow: visible;
    }

    h1 {
      font-size: 28px;
    }

    h1 br {
      display: none;
    }

    .intro-copy,
    .reference-note p,
    .reference-stats {
      display: none;
    }

    .reference-note {
      grid-column: 2;
      grid-row: 1;
      align-self: center;
    }

    .solid-link {
      min-height: 44px;
      margin: 0;
      padding: 8px 12px;
      gap: 10px;
    }

    .table-heading {
      min-height: auto;
      padding-block: 16px;
    }
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 24px;
    }

    .reference-writing {
      column-gap: 10px;
    }

    .solid-link {
      padding: 8px;
      font-size: 11px;
      gap: 6px;
    }

    .group-intro h2 {
      font-size: 28px;
    }

    thead th:first-child {
      width: 48%;
    }

    thead th:nth-child(2) {
      width: 52%;
    }

    .token-label {
      gap: 10px;
    }

    .swatch {
      width: 26px;
      height: 32px;
    }

    code {
      font-size: 10px;
    }

    td :global(.copy-button) {
      padding-right: 0;
    }

    .solid-link span {
      display: none;
    }

    .solid-link {
      width: 44px;
      padding: 0;
    }

    .table-tools > span {
      font-size: 10px;
    }
  }
</style>
