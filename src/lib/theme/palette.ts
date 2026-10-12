export type HexColor = `#${string}`

export const roles = ['surface', 'muted', 'foreground', 'emphasis'] as const
export type Role = (typeof roles)[number]

interface PaletteFamily extends Readonly<Record<Role, HexColor>> {
  readonly id: string
  readonly name: string
  readonly description: string
}

export const surfaces = {
  background: '#161616',
  working: '#1A1A1A',
  raised: '#242424',
} as const satisfies Readonly<Record<string, HexColor>>

export const families = [
  {
    id: 'static',
    name: 'Static',
    description: 'A soft, steady neutral.',
    surface: '#272725',
    muted: '#545450',
    foreground: '#92918B',
    emphasis: '#AAA9A2',
  },
  {
    id: 'halo',
    name: 'Halo',
    description: 'The violet edge of an orbit.',
    surface: '#292831',
    muted: '#58566F',
    foreground: '#A19EC2',
    emphasis: '#8A83B0',
  },
  {
    id: 'afterglow',
    name: 'Afterglow',
    description: 'A little warmth, lingering.',
    surface: '#352426',
    muted: '#955B5D',
    foreground: '#DC8789',
    emphasis: '#CE7076',
  },
  {
    id: 'remnant',
    name: 'Remnant',
    description: 'Dusty rose from a distant light.',
    surface: '#382731',
    muted: '#855B70',
    foreground: '#C88DA5',
    emphasis: '#BC728F',
  },
  {
    id: 'unripe',
    name: 'Unripe',
    description: 'Life finding its own rhythm.',
    surface: '#292B23',
    muted: '#5B6148',
    foreground: '#A0A77B',
    emphasis: '#8B965C',
  },
  {
    id: 'life',
    name: 'Life',
    description: 'A green with its feet on earth.',
    surface: '#252E29',
    muted: '#4B6A5A',
    foreground: '#7DAD96',
    emphasis: '#539579',
  },
  {
    id: 'regolith',
    name: 'Regolith',
    description: 'The warmth of lunar dust.',
    surface: '#302922',
    muted: '#735940',
    foreground: '#BD9976',
    emphasis: '#B78658',
  },
  {
    id: 'moonveil',
    name: 'Moonveil',
    description: 'Quiet light across the surface.',
    surface: '#2E2D29',
    muted: '#77766D',
    foreground: '#C1BFB3',
    emphasis: '#D9D7CD',
  },
] as const satisfies readonly PaletteFamily[]

export type Family = (typeof families)[number]
export type FamilyId = Family['id']
export const base = {
  'background': surfaces.background,
  'text-primary': '#C1BFB3',
  'text-secondary': '#92918B',
  'text-muted': '#77766D',
} as const

type FamilyById = { readonly [Item in Family as Item['id']]: Item }

export const familyById =
  Object.fromEntries(
    families.map((family) => [family.id, family]),
  ) as FamilyById

export const familyIndex: Readonly<Record<FamilyId, number>> =
  Object.fromEntries(
    families.map((family, index) => [family.id, index]),
  ) as Record<FamilyId, number>

export const siteStyle = [
  `--page:${base.background}`,
  `--panel:${surfaces.working}`,
  `--ink:${base['text-primary']}`,
  `--secondary:${base['text-secondary']}`,
  ...families.flatMap((family) =>
    roles.map((role) => `--${family.id}-${role}:${family[role]}`),
  ),
].join(';')
