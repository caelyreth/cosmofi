<script lang="ts">
  import type { Family, HexColor, Theme } from 'cosmofi'
  import { untrack } from 'svelte'
  import type { Attachment } from 'svelte/attachments'

  import { rgbChannels } from '#lib/theme/color'

  import type { SignalRenderer, SignalState } from './signal/renderer'
  import type { SignalAccents } from './signal/text-field'

  interface Props {
    family: Family
    paused?: boolean
    theme: Theme
  }

  let { family, paused = false, theme }: Props = $props()
  let failed = $state(false)
  let ready = $state(false)

  function signalState(
    nextFamily: Family,
    nextPaused: boolean,
    nextTheme: Theme,
  ): SignalState {
    const accents: SignalAccents = {
      keyword: channels(nextTheme.familyById.remnant.foreground),
      type: channels(nextTheme.familyById.regolith.foreground),
      string: channels(nextTheme.familyById.unripe.foreground),
      neutral: channels(nextTheme.familyById.static.foreground),
    }
    const glowSource =
      nextTheme.scheme === 'dark'
        ? nextTheme.familyById.moonveil.emphasis
        : nextTheme.surfaces.background

    return {
      family: nextFamily,
      paused: nextPaused,
      scheme: nextTheme.scheme,
      glow: channels(glowSource),
      accents,
    }
  }

  function channels(color: HexColor) {
    return rgbChannels(color).join(',')
  }

  const attachRenderer: Attachment<HTMLCanvasElement> = (canvas) => {
    let renderer = $state.raw<SignalRenderer | undefined>(undefined)
    let disposed = false

    $effect(() => {
      renderer?.update(signalState(family, paused, theme))
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
              signalState(family, paused, theme),
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
