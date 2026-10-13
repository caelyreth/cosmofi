<script lang="ts">
  import {
    families,
    roles,
    type Family,
    type FamilyId,
  } from 'cosmofi-starfield'

  import { rovingFocus } from '#lib/attachments/roving-focus'
  import { readableInk } from '#lib/theme/color'

  interface Props {
    family: Family
    onselect: (id: FamilyId) => void
  }

  let { family, onselect }: Props = $props()
</script>

<div
  class="spectrum-bands"
  role="group"
  aria-label="Explore color families"
  {@attach rovingFocus}
>
  {#each families as item}
    <button
      type="button"
      class="band"
      class:selected={item.id === family.id}
      style:--field={item.foreground}
      style:--band-ink={readableInk(item.foreground)}
      aria-pressed={item.id === family.id}
      tabindex={item.id === family.id ? 0 : -1}
      aria-label={`Select ${item.name}`}
      onclick={() => onselect(item.id)}
    >
      <span class="band-name">{item.name}</span>
      <span class="band-description">{item.description}</span>
      <span class="band-code mono">
        {item.foreground}
      </span>
      <span class="shade-stack" aria-hidden="true">
        {#each roles as role}
          <i style:background={item[role]}></i>
        {/each}
      </span>
      <span class="band-corner" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M5 19 19 5M5 5h14v14" />
        </svg>
      </span>
    </button>
  {/each}
</div>

<style>
  .spectrum-bands {
    display: flex;
    gap: 3px;
    height: clamp(220px, 31svh, 310px);
  }

  .band {
    position: relative;
    min-width: 0;
    flex: 1;
    border: 0;
    border-radius: 0;
    padding: 22px 14px;
    background: var(--field);
    color: var(--band-ink);
    text-align: left;
    overflow: hidden;
    transition:
      flex-grow 550ms cubic-bezier(0.16, 1, 0.3, 1),
      background 400ms,
      color 400ms;
  }

  .band.selected {
    flex: 2.7;
  }

  .band-name {
    position: absolute;
    top: 35px;
    left: 46px;
    white-space: nowrap;
    transform: rotate(90deg);
    transform-origin: left top;
    font: 500 var(--text-title)/1 var(--font-brand);
    letter-spacing: 0;
  }

  .band.selected .band-name {
    left: 14px;
    transform: rotate(0deg) scale(1.3);
  }

  .band-description {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 250ms,
      transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    position: absolute;
    top: 106px;
    left: 14px;
    right: 22px;
    font-size: var(--text-small);
    line-height: 1.7;
  }

  .band.selected .band-description {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 160ms;
  }

  .band-code {
    position: absolute;
    bottom: 62px;
    left: 14px;
    font-size: var(--text-small);
    white-space: nowrap;
  }

  .shade-stack {
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    height: 39px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .band-corner {
    position: absolute;
    bottom: 59px;
    right: 16px;
    display: none;
  }

  .band.selected .band-corner {
    display: block;
  }

  .band-name {
    transition:
      transform 650ms cubic-bezier(0.16, 1, 0.3, 1),
      left 650ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (max-width: 1000px) {
    .spectrum-bands {
      height: clamp(220px, 31svh, 280px);
    }

    .band {
      padding-inline: 10px;
    }

    .band-description,
    .band-code {
      left: 10px;
    }

    .band.selected {
      flex: 2.4;
    }

    .band.selected .band-name {
      left: 10px;
      font-size: var(--text-title);
      transform: rotate(0deg);
    }

    .band.selected .band-corner {
      display: none;
    }
  }

  @media (max-width: 700px) {
    .spectrum-bands {
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      height: 38px;
      gap: 3px;
    }

    .band {
      height: 38px;
      padding: 0;
      opacity: 0.58;
      transition: opacity 220ms;
    }

    .band.selected {
      opacity: 1;
    }

    .band-name,
    .band-description,
    .band-code,
    .band-corner,
    .shade-stack {
      display: none;
    }
  }

  .shade-stack i {
    transform-origin: bottom;
    transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
    transform: scaleY(0.72);
  }

  .band.selected .shade-stack i {
    transform: scaleY(1);
  }
</style>
