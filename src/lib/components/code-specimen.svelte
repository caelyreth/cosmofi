<script lang="ts">
  import type { Attachment } from 'svelte/attachments'

  import { overflowFocus } from '#lib/attachments/overflow-focus'
  import { rovingFocus } from '#lib/attachments/roving-focus'
  import type { CodeExample, LanguageId } from '#lib/syntax'

  let {
    examples,
    language = $bindable<LanguageId>('ts'),
  }: {
    examples: CodeExample[]
    language?: LanguageId
  } = $props()

  const selected = $derived(
    examples.find((example) => example.id === language) ?? examples[0],
  )

  const attachCodeAccessibility: Attachment<HTMLDivElement> = (element) => {
    const gutter = element.querySelector('.shj-multiline > div > div:first-child')

    gutter?.setAttribute('aria-hidden', 'true')
    gutter?.setAttribute('data-nosnippet', '')
  }
</script>

<div class="code-specimen">
  <div class="source-heading">
    <div
      class="source-tabs"
      role="tablist"
      aria-label="Example language"
      {@attach rovingFocus}
    >
      {#each examples as example (example.id)}
        <button
          type="button"
          id={`source-tab-${example.id}`}
          role="tab"
          aria-selected={selected.id === example.id}
          aria-controls="code-example-panel"
          aria-label={`${example.label}: ${example.name}`}
          tabindex={selected.id === example.id ? 0 : -1}
          onclick={() => (language = example.id)}
        >
          {example.label}
        </button>
      {/each}
    </div>
    <span class="source-file mono">{selected.file}</span>
  </div>

  {#key selected.id}
    <div
      id="code-example-panel"
      class="code-scroll"
      tabindex="-1"
      role="tabpanel"
      aria-labelledby={`source-tab-${selected.id}`}
      {@attach overflowFocus}
      {@attach attachCodeAccessibility}
    >
      {@html selected.html}
    </div>
  {/key}

  <div class="source-foot instrument-label" aria-hidden="true" data-nosnippet>
    <span>{selected.name}</span>
    <span>Cosmofi syntax</span>
  </div>
</div>

<style>
  .code-specimen {
    min-width: 0;
    width: 100%;
    color: var(--ink);
    background: var(--panel);
  }

  .source-heading {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #333333;
  }

  .source-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .source-tabs button {
    position: relative;
    min-height: 44px;
    font-size: var(--text-small);
    color: var(--secondary);
    transition: color 180ms;
  }

  .source-tabs button::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: var(--halo-foreground);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease-out;
  }

  .source-tabs button[aria-selected='true'] {
    color: var(--ink);
  }

  .source-tabs button[aria-selected='true']::after {
    transform: scaleX(1);
  }

  .source-tabs button:hover {
    color: var(--halo-foreground);
  }

  .source-file {
    font-size: var(--text-small);
    color: var(--secondary);
  }

  .code-scroll {
    min-width: 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding-block: 24px;
  }

  /* Adjust Rangi's inline layout defaults; the theme owns all syntax colors. */
  .code-scroll :global(.shj-multiline) {
    --code-size: var(--text-small);
    --code-line-height: calc(var(--code-size) * 1.9);
    min-height: 20lh;
    margin: 0 !important;
    padding: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    font: var(--code-size) / var(--code-line-height) var(--font-code) !important;
  }

  .code-scroll :global(.shj-multiline > div) {
    width: max-content;
    min-width: 100%;
    overflow: visible !important;
  }

  .code-scroll :global(.shj-multiline > div > div:first-child) {
    position: sticky;
    left: 0;
    width: 40px;
    flex-shrink: 0;
    align-self: stretch;
    background: var(--panel);
    font-size: var(--text-small);
    line-height: inherit;
    opacity: 1 !important;
  }

  .source-foot {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #333333;
    color: var(--secondary);
    font-size: var(--text-small);
  }

  @media (max-width: 700px) {
    .source-tabs {
      gap: 18px;
    }

  }
</style>
