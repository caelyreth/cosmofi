<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    labelledBy: string
    copy: Snippet
    visual: Snippet
    first?: boolean
    code?: boolean
  }

  let {
    labelledBy,
    copy,
    visual,
    first = false,
    code = false,
  }: Props = $props()
</script>

<section
  class="chapter split-screen"
  class:continuation={!first}
  aria-labelledby={labelledBy}
>
  <div class="chapter-copy">
    <div class="chapter-writing">
      {@render copy()}
    </div>
  </div>

  <div class="chapter-visual">
    <div class="visual-content" class:code-content={code}>
      {@render visual()}
    </div>
  </div>
</section>

<style>
  .chapter {
    min-height: 100%;
    border-bottom: 1px solid var(--line);
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

  @media (max-width: 700px) {
    .chapter {
      grid-template-columns: minmax(0, 1fr);
      min-height: auto;
    }

    .chapter-copy {
      padding-bottom: 32px;
    }

    .chapter.continuation .chapter-copy {
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
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .chapter {
        view-timeline-name: --chapter;
        view-timeline-axis: block;
      }

      .chapter.continuation .chapter-writing,
      .chapter.continuation .visual-content {
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
