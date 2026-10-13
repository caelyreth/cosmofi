<script lang="ts">
  import type { Family } from 'cosmofi-starfield'
  import { untrack } from 'svelte'
  import type { Attachment } from 'svelte/attachments'

  import type { SignalRenderer } from './signal/renderer'

  interface Props {
    family: Family
    paused?: boolean
  }

  let { family, paused = false }: Props = $props()
  let failed = $state(false)
  let ready = $state(false)

  const attachRenderer: Attachment<HTMLCanvasElement> = (canvas) => {
    let renderer = $state.raw<SignalRenderer | undefined>(undefined)
    let disposed = false

    $effect(() => {
      renderer?.update({ family, paused })
    })

    void import('./signal/renderer').then(
      ({ createSignalRenderer }) => {
        if (disposed) {
          return
        }

        try {
          renderer = untrack(() =>
            createSignalRenderer(
              canvas,
              { family, paused },
              {
                onready: () => {
                  if (!disposed) {
                    ready = true
                  }
                },
              },
            ),
          )
        } catch {
          failed = true
        }
      },
      () => {
        if (!disposed) {
          failed = true
        }
      },
    )

    return () => {
      disposed = true
      renderer?.destroy()
    }
  }
</script>

<div class="signal-field">
  <canvas class:ready {@attach attachRenderer} aria-hidden="true"></canvas>
  {#if failed}
    <p>
      The signal image is unavailable.<br />Explore the palette with the
      tuner below.
    </p>
  {/if}
</div>

<style>
  .signal-field,
  canvas {
    width: 100%;
    height: 100%;
  }

  canvas {
    display: block;
    opacity: 0;
  }

  canvas.ready {
    opacity: 1;
    animation: signal-enter 1000ms ease-out both;
  }

  @keyframes signal-enter {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  p {
    position: absolute;
    left: 55%;
    top: 50%;
    font-size: var(--text-small);
    color: var(--secondary);
  }
</style>
