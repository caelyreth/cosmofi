<script lang="ts">
  import type { Family, FamilyId } from 'cosmofi'

  import type { Direction } from '#lib/motion/direction'

  import FamilyBands from './family-bands.svelte'
  import FamilySpecimen from './family-specimen.svelte'

  interface Props {
    family: Family
    direction: Direction
    onselect: (id: FamilyId) => void
  }

  let { family, direction, onselect }: Props = $props()
</script>

<div class="spectrum-register">
  <FamilyBands {family} {onselect} />
  <FamilySpecimen {family} {direction} />
</div>
