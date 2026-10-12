<script lang="ts">
  import type { Attachment } from 'svelte/attachments'

  let {
    channel = 1,
    mix = 50,
    paused = false,
  }: { channel?: number; mix?: number; paused?: boolean } = $props()
  const gridId = $props.id()
  let phase = $state(0)
  let pulse = $derived(Math.exp(-((phase % 1.7) / 1.7) * 12))
  const samples = 180
  let traces = $derived(
    Array.from({ length: 3 }, (_, layer) =>
      Array.from({ length: samples }, (_, i) => {
        const x = i * 4
        const envelope =
          0.25 + 0.75 * Math.sin((i / samples) * Math.PI) ** 2
        const y =
          75 +
          Math.sin(i * (0.12 + channel * 0.022) + phase + layer * 0.32) *
            (14 + mix * 0.35 + pulse * 22) *
            envelope +
          Math.sin(i * 0.71 - phase) * (4 + layer * 2)
        return `${i === 0 ? 'M' : 'L'}${x},${y.toFixed(2)}`
      }).join(' '),
    ),
  )

  const attachAnimation: Attachment<HTMLDivElement> = (element) => {
    let frame = 0
    let last = 0
    let visible = true

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      start()
    })
    observer.observe(element)

    function running() {
      return !paused && visible && !document.hidden
    }

    function tick(now: number) {
      frame = 0
      if (!running()) {
        return
      }

      if (now - last > 60) {
        phase += 0.06
        last = now
      }
      frame = requestAnimationFrame(tick)
    }

    function start() {
      if (!running()) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (!frame) {
        frame = requestAnimationFrame(tick)
      }
    }

    $effect(start)

    document.addEventListener('visibilitychange', start)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', start)
    }
  }
</script>

<div class="scope" {@attach attachAnimation}>
  <div class="scope-top instrument-label">
    <span>Signal study / Synthesized waveform</span>
    <span>Channel {channel + 1} / 8</span>
  </div>
  <svg
    viewBox="0 0 716 150"
    preserveAspectRatio="none"
    role="img"
    aria-label="Synthesized waveform that changes with the selected palette channel"
  >
    <defs>
      <pattern
        id={gridId}
        width="28"
        height="25"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M28 0H0V25"
          fill="none"
          stroke="currentColor"
          stroke-width=".4"
          opacity=".28"
        />
      </pattern>
    </defs>
    <rect width="716" height="150" fill={`url(#${gridId})`} />
    {#each traces as trace, index}
      <path
        d={trace}
        fill="none"
        stroke="currentColor"
        opacity={index === 0 ? 0.65 + pulse * 0.35 : 0.15 + pulse * 0.18}
        stroke-width={index === 0 ? 1.4 : 0.7}
        vector-effect="non-scaling-stroke"
      />
    {/each}
    <path
      d="M0 75H716"
      fill="none"
      stroke="currentColor"
      opacity=".25"
      stroke-dasharray="2 6"
    />
  </svg>
  <div class="scope-bottom instrument-label">
    <span>Cosmic in scale</span>
    <span>Lo-fi in feeling</span>
  </div>
</div>

<style>
  .scope {
    color: var(--page);
  }
  .scope-top,
  .scope-bottom {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    font-size: 7px;
  }
  .scope-top {
    margin-bottom: 15px;
  }
  .scope-bottom {
    margin-top: 12px;
  }
  svg {
    display: block;
    width: 100%;
    height: 120px;
  }
  @media (max-width: 600px) {
    .scope-top,
    .scope-bottom {
      font-size: 6px;
    }
    svg {
      height: 80px;
    }
  }
</style>
