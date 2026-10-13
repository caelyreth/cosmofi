<script lang="ts">
  import type { HexColor } from 'cosmofi'

  import { colorRepresentation, type ColorFormat } from '#lib/theme/color'

  import CopyButton from './copy-button.svelte'

  interface Props {
    color: HexColor
    format?: ColorFormat
    name?: string
  }

  let { color, format = 'hex', name = 'color' }: Props = $props()

  const representation = $derived(colorRepresentation(color, format))
</script>

<CopyButton
  value={representation.copy}
  displayValue={representation.display}
  label={`Copy ${name} as ${format.toUpperCase()}`}
/>
