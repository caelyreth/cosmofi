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
] as const

export type Family = (typeof families)[number]
export type FamilyId = Family['id']
export const roles = ['surface', 'muted', 'foreground', 'emphasis'] as const
export type Role = (typeof roles)[number]

export const base = {
  'background': '#161616',
  'text-primary': '#C1BFB3',
  'text-secondary': '#92918B',
  'text-muted': '#545450',
} as const

export type TokenGroupId = 'base' | FamilyId

export const tokenGroups = [
  {
    id: 'base',
    name: 'Base',
    description: 'Charcoal ground. Three levels of reading light.',
    foreground: base['text-primary'],
  },
  ...families,
] as const

export type Token = {
  name: string
  value: string
  rgb: string
  group: TokenGroupId
  family: string
}

export function rgb(hex: string) {
  return [1, 3, 5]
    .map((start) => Number.parseInt(hex.slice(start, start + 2), 16))
    .join(', ')
}

const baseTokens: Token[] = Object.entries(base).map(([name, value]) => ({
  name,
  value,
  rgb: rgb(value),
  group: 'base',
  family: 'Base',
}))

const familyTokens: Token[] = families.flatMap((family) =>
  roles.map((role) => ({
    name: `${family.id}-${role}`,
    value: family[role],
    rgb: rgb(family[role]),
    group: family.id,
    family: family.name,
  })),
)

export const tokens: readonly Token[] = [...baseTokens, ...familyTokens]

export const tokensByGroup: Readonly<
  Record<TokenGroupId, readonly Token[]>
> = tokenGroups.reduce(
  (groups, group) => {
    groups[group.id] = tokens.filter((token) => token.group === group.id)
    return groups
  },
  {} as Record<TokenGroupId, readonly Token[]>,
)

export const familyById: Readonly<Record<FamilyId, Family>> =
  Object.fromEntries(
    families.map((family) => [family.id, family]),
  ) as Record<FamilyId, Family>

export const familyIndex: Readonly<Record<FamilyId, number>> =
  Object.fromEntries(
    families.map((family, index) => [family.id, index]),
  ) as Record<FamilyId, number>

export const cssExport = `/* Cosmofi Starfield by Caelyreth
 * Swatch roles are descriptive; terminal/editor mappings are not specified.
 */
:root {
${tokens.map((token) => `  --cosmofi-${token.name}: ${token.value};`).join('\n')}
}
`

export const siteStyle = [
  `--page:${base.background}`,
  `--ink:${base['text-primary']}`,
  `--secondary:${base['text-secondary']}`,
  ...families.flatMap((family) =>
    roles.map((role) => `--${family.id}-${role}:${family[role]}`),
  ),
].join(';')
