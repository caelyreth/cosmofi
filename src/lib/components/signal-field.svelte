<script lang="ts">
  import { untrack } from 'svelte'
  import type { Attachment } from 'svelte/attachments'

  import { createSignalField } from '#lib/signal-field'
  import type { Family } from '#lib/theme'

  let { family, paused = false }: { family: Family; paused?: boolean } =
    $props()
  let failed = $state(false)

  const attachRenderer: Attachment<HTMLCanvasElement> = (canvas) => {
    let renderer: ReturnType<typeof createSignalField>

    try {
      // Color updates belong to the nested effect, preserving this renderer's timeline.
      renderer = untrack(() => createSignalField(canvas, family))
    } catch {
      failed = true
      return
    }

    $effect(() => {
      renderer.update(family, paused)
    })

    return () => renderer.destroy()
  }
</script>

<div class="signal-field">
  <canvas
    {@attach attachRenderer}
    aria-hidden="true"
  ></canvas>
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
  }
  p {
    position: absolute;
    left: 55%;
    top: 50%;
    font-size: var(--text-small);
    color: var(--secondary);
  }
</style>
