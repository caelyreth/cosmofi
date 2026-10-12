<script lang="ts">
  import {
    colorDisplayValue,
    colorValue,
    type ColorFormat,
  } from '#lib/color'

  import CopyButton from './copy-button.svelte'

  let {
    color,
    format = 'hex',
    name = 'color',
  }: { color: string; format?: ColorFormat; name?: string } = $props()

  const value = $derived(colorValue(color, format))
  const displayValue = $derived(colorDisplayValue(color, format))
</script>

<CopyButton
  {value}
  {displayValue}
  label={`Copy ${name} as ${format.toUpperCase()}`}
/>
