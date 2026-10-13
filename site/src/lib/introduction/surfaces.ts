import { surfaces as paletteSurfaces } from 'cosmofi'

export const surfaces = [
  {
    id: 'background',
    name: 'Background',
    color: paletteSurfaces.background,
  },
  {
    id: 'working',
    name: 'Working surface',
    color: paletteSurfaces.working,
  },
  { id: 'raised', name: 'Raised plane', color: paletteSurfaces.raised },
] as const

export const planeSeparation = 76
