<script lang="ts">
  import { source, highlight } from '#lib/specimen.js'
  import { type Family } from '#lib/theme.js'

  let { family }: { family: Family } = $props()
  let file = $state('signal.ts')
  let lines = $derived(
    file === 'signal.ts'
      ? source
      : [
          '/* Cosmofi Starfield / selected family */',
          ':root {',
          `  --${family.id}-surface: ${family.surface};`,
          `  --${family.id}-muted: ${family.muted};`,
          `  --${family.id}-foreground: ${family.foreground};`,
          `  --${family.id}-emphasis: ${family.emphasis};`,
          '}',
          '',
          '.workspace {',
          `  background: var(--${family.id}-surface);`,
          `  color: var(--${family.id}-foreground);`,
          '}',
        ],
  )
  let highlightedLines = $derived(lines.map((line) => highlight(line)))
</script>

{#snippet codeLine(segments: ReturnType<typeof highlight>, index: number)}
  <span class="code-line">
    <span class="line-number" aria-hidden="true">
      {String(index + 1).padStart(2, '0')}
    </span>
    <span class="line-source"
      >{#each segments as segment}<span class={segment.kind}
          >{segment.text}</span
        >{/each}</span
    >
  </span>
{/snippet}

<div
  class="workspace-content"
  style:--channel={family.foreground}
  style:--channel-surface={family.surface}
>
  <div class="source-tabs" role="group" aria-label="Example source files">
    {#each ['signal.ts', 'palette.css'] as name}
      <button aria-pressed={file === name} onclick={() => (file = name)}>
        {name}
      </button>
    {/each}
    <span class="instrument-label"
      >{file === 'signal.ts' ? 'TypeScript' : 'CSS'}</span
    >
  </div>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Focus allows keyboard scrolling of the code specimen.) -->
  <div
    class="code-scroll"
    tabindex="0"
    role="region"
    aria-label={`${file} code specimen`}
  >
    <pre><code
        >{#each highlightedLines as segments, index}{@render codeLine(
            segments,
            index,
          )}{/each}</code
      ></pre>
  </div>
  <div class="source-foot instrument-label">
    <span>Illustrative syntax mapping</span>
    <span
      >{String(lines.length).padStart(2, '0')} lines / {family.name}</span
    >
  </div>
</div>

<style>
  .workspace-content {
    position: relative;
    min-width: 0;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-rows: var(--content-top) minmax(0, 1fr) calc(
        2 * var(--edge-inset) + 14px + env(safe-area-inset-bottom)
      );
    background-color: var(--panel);
  }
  .source-tabs {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: var(--header-top) var(--page-inset) var(--edge-inset);
  }
  .source-tabs button {
    position: relative;
    min-height: 44px;
    background: none;
    border: 0;
    padding: 0;
    font-size: 12px;
    color: var(--secondary);
    transition: color 220ms;
  }
  .source-tabs button::after {
    content: '';
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    height: 2px;
    background: var(--channel);
    transform: scaleX(0);
    transform-origin: left;
    transition:
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
      background 400ms;
  }
  .source-tabs button[aria-pressed='true'] {
    color: var(--ink);
  }
  .source-tabs button[aria-pressed='true']::after {
    transform: scaleX(1);
  }
  .source-tabs button:hover {
    color: var(--channel);
  }
  .source-tabs > span {
    margin-left: auto;
    font-size: 8px;
    color: var(--secondary);
  }
  .code-scroll {
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding: var(--edge-inset) var(--page-inset);
    align-content: safe center;
  }
  pre {
    margin: 0;
    font:
      13px/1.95 'Martian Mono',
      monospace;
  }
  .code-line {
    display: flex;
    min-height: 1.85em;
  }
  .line-number {
    width: 34px;
    padding-top: 2px;
    flex-shrink: 0;
    user-select: none;
    color: var(--static-foreground);
    font-size: 9px;
  }
  .comment {
    color: var(--secondary);
  }
  .keyword {
    color: var(--remnant-foreground);
  }
  .string {
    color: var(--unripe-foreground);
  }
  .type {
    color: var(--regolith-foreground);
  }
  .function {
    color: var(--channel);
    transition: color 400ms;
  }
  .source-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 0 var(--page-inset) env(safe-area-inset-bottom);
    color: var(--secondary);
    font-size: 8px;
  }
  @media (max-width: 900px) and (min-height: 501px), (max-width: 600px) {
    .workspace-content {
      grid-template-rows: 48px minmax(0, 1fr) calc(
          32px + env(safe-area-inset-bottom)
        );
    }
    .source-tabs {
      padding: 0 var(--page-inset);
    }
    .code-scroll {
      align-content: start;
      padding: 16px var(--page-inset);
    }
    .source-foot {
      font-size: 7px;
    }
  }
  @media (max-width: 600px) {
    .source-tabs {
      gap: 20px;
    }
    .code-scroll {
      padding-block: 16px;
    }
    pre {
      font-size: 12px;
    }
    .line-number {
      width: 26px;
      font-size: 8px;
    }
  }
</style>
