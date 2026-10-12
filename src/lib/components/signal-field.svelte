<script lang="ts">
  import type { Attachment } from 'svelte/attachments'

  import { createSignalField } from '#lib/signal-field'
  import { families, type Family } from '#lib/theme'

  let { family, paused = false }: { family: Family; paused?: boolean } =
    $props()
  let failed = $state(false)

  const attachRenderer: Attachment<HTMLCanvasElement> = (canvas) => {
    let renderer: ReturnType<typeof createSignalField>

    try {
      renderer = createSignalField(canvas, families[0])
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
    aria-label="Layered synthesized waveforms and flowing code tokens, colored by the selected family"
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
    font-size: 12px;
    color: var(--secondary);
  }
</style>
