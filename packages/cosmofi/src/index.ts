export type HexColor = `#${string}`

export const roles = ['surface', 'muted', 'foreground', 'emphasis'] as const
export type Role = (typeof roles)[number]

export const familyIds = [
  'static',
  'halo',
  'afterglow',
  'remnant',
  'unripe',
  'life',
  'regolith',
  'moonveil',
] as const

export type FamilyId = (typeof familyIds)[number]

export interface Family extends Readonly<Record<Role, HexColor>> {
  readonly id: FamilyId
  readonly name: string
  readonly description: string
}

interface Surfaces {
  readonly background: HexColor
  readonly working: HexColor
  readonly raised: HexColor
}

interface Lines {
  readonly hairline: HexColor
  readonly guide: HexColor
  readonly track: HexColor
}

interface Base {
  readonly 'background': HexColor
  readonly 'text-primary': HexColor
  readonly 'text-secondary': HexColor
  readonly 'text-muted': HexColor
}

export interface SyntaxColors {
  readonly punctuation: HexColor
  readonly variable: HexColor
  readonly keyword: HexColor
  readonly function: HexColor
  readonly string: HexColor
  readonly constant: HexColor
  readonly type: HexColor
  readonly number: HexColor
  readonly comment: HexColor
}

export const themeIds = ['starfield', 'daybreak'] as const
export type ThemeId = (typeof themeIds)[number]
export type Scheme = 'dark' | 'light'

export interface Theme {
  readonly id: ThemeId
  readonly name: string
  readonly scheme: Scheme
  readonly surfaces: Surfaces
  readonly lines: Lines
  readonly families: readonly Family[]
  readonly familyById: { readonly [Id in FamilyId]: Family }
  readonly familyIndex: Readonly<Record<FamilyId, number>>
  readonly base: Base
  readonly syntaxColors: SyntaxColors
}

const identity = [
  {
    id: 'static',
    name: 'Static',
    description: 'A soft, steady neutral.',
  },
  {
    id: 'halo',
    name: 'Halo',
    description: 'The violet edge of an orbit.',
  },
  {
    id: 'afterglow',
    name: 'Afterglow',
    description: 'A little warmth, lingering.',
  },
  {
    id: 'remnant',
    name: 'Remnant',
    description: 'Dusty rose from a distant light.',
  },
  {
    id: 'unripe',
    name: 'Unripe',
    description: 'Life finding its own rhythm.',
  },
  {
    id: 'life',
    name: 'Life',
    description: 'A green with its feet on earth.',
  },
  {
    id: 'regolith',
    name: 'Regolith',
    description: 'The warmth of lunar dust.',
  },
  {
    id: 'moonveil',
    name: 'Moonveil',
    description: 'Quiet light across the surface.',
  },
] as const satisfies readonly {
  readonly id: FamilyId
  readonly name: string
  readonly description: string
}[]

type FamilyColors = Readonly<
  Record<FamilyId, Readonly<Record<Role, HexColor>>>
>

interface ThemeSpec {
  readonly id: ThemeId
  readonly name: string
  readonly scheme: Scheme
  readonly surfaces: Surfaces
  readonly lines: Lines
  readonly colors: FamilyColors
}

function syntaxFor(
  familyById: Theme['familyById'],
  base: Base,
): SyntaxColors {
  return {
    punctuation: base['text-muted'],
    variable: base['text-primary'],
    keyword: familyById.afterglow.foreground,
    function: familyById.halo.foreground,
    string: familyById.unripe.foreground,
    constant: familyById.life.emphasis,
    type: familyById.regolith.foreground,
    number: familyById.regolith.foreground,
    comment: base['text-secondary'],
  }
}

function defineTheme(spec: ThemeSpec): Theme {
  const families = identity.map((item) => ({
    ...item,
    ...spec.colors[item.id],
  }))
  const familyById = Object.fromEntries(
    families.map((family) => [family.id, family]),
  ) as Theme['familyById']
  const familyIndex = Object.fromEntries(
    families.map((family, index) => [family.id, index]),
  ) as Theme['familyIndex']
  const base = {
    'background': spec.surfaces.background,
    'text-primary': familyById.moonveil.foreground,
    'text-secondary': familyById.static.foreground,
    'text-muted': familyById.moonveil.muted,
  } as const

  return {
    id: spec.id,
    name: spec.name,
    scheme: spec.scheme,
    surfaces: spec.surfaces,
    lines: spec.lines,
    families,
    familyById,
    familyIndex,
    base,
    syntaxColors: syntaxFor(familyById, base),
  }
}

const starfield = defineTheme({
  id: 'starfield',
  name: 'Starfield',
  scheme: 'dark',
  surfaces: {
    background: '#161616',
    working: '#1A1A1A',
    raised: '#242424',
  },
  lines: {
    hairline: '#333333',
    guide: '#404040',
    track: '#545450',
  },
  colors: {
    static: {
      surface: '#272725',
      muted: '#545450',
      foreground: '#92918B',
      emphasis: '#AAA9A2',
    },
    halo: {
      surface: '#292831',
      muted: '#58566F',
      foreground: '#A19EC2',
      emphasis: '#8A83B0',
    },
    afterglow: {
      surface: '#352426',
      muted: '#955B5D',
      foreground: '#DC8789',
      emphasis: '#CE7076',
    },
    remnant: {
      surface: '#382731',
      muted: '#855B70',
      foreground: '#C88DA5',
      emphasis: '#BC728F',
    },
    unripe: {
      surface: '#292B23',
      muted: '#5B6148',
      foreground: '#A0A77B',
      emphasis: '#8B965C',
    },
    life: {
      surface: '#252E29',
      muted: '#4B6A5A',
      foreground: '#7DAD96',
      emphasis: '#539579',
    },
    regolith: {
      surface: '#302922',
      muted: '#735940',
      foreground: '#BD9976',
      emphasis: '#B78658',
    },
    moonveil: {
      surface: '#2E2D29',
      muted: '#77766D',
      foreground: '#C1BFB3',
      emphasis: '#D9D7CD',
    },
  },
})

// Daybreak keeps Starfield's hues and places each role the same distance
// from a gray paper ground. Life emphasis is one step deeper so constants
// stay as readable as they are at night.
const daybreak = defineTheme({
  id: 'daybreak',
  name: 'Daybreak',
  scheme: 'light',
  surfaces: {
    background: '#F7F7F6',
    working: '#F2F2F0',
    raised: '#E8E8E6',
  },
  lines: {
    hairline: '#D2D2D0',
    guide: '#C2C2C0',
    track: '#A0A09C',
  },
  colors: {
    static: {
      surface: '#E5E5E3',
      muted: '#B7B7B3',
      foreground: '#6E6D68',
      emphasis: '#5E5D58',
    },
    halo: {
      surface: '#E1E1E9',
      muted: '#AFAEC5',
      foreground: '#696685',
      emphasis: '#726C96',
    },
    afterglow: {
      surface: '#EDDDDE',
      muted: '#BE8B8C',
      foreground: '#9A5255',
      emphasis: '#A5545A',
    },
    remnant: {
      surface: '#EAD6E2',
      muted: '#C28CA6',
      foreground: '#975172',
      emphasis: '#A84B73',
    },
    unripe: {
      surface: '#E0E2DA',
      muted: '#A8B08F',
      foreground: '#6A7038',
      emphasis: '#69752A',
    },
    life: {
      surface: '#D9E1DC',
      muted: '#93AFA0',
      foreground: '#4C7663',
      emphasis: '#387562',
    },
    regolith: {
      surface: '#E7DFD6',
      muted: '#C6A483',
      foreground: '#8D6135',
      emphasis: '#9B5F1E',
    },
    moonveil: {
      surface: '#DEDDD9',
      muted: '#8C8B84',
      foreground: '#535248',
      emphasis: '#45433D',
    },
  },
})

export const themes = { starfield, daybreak } as const

const {
  surfaces,
  lines,
  families,
  familyById,
  familyIndex,
  base,
  syntaxColors,
} = starfield

export {
  surfaces,
  lines,
  families,
  familyById,
  familyIndex,
  base,
  syntaxColors,
}

function variable(name: string, value: string) {
  return `--cosmofi-${name}: ${value};`
}

function themeDeclarations(theme: Theme) {
  const {
    syntaxColors: syntax,
    surfaces: planes,
    base: ink,
    lines: rules,
  } = theme
  const familyVariables = theme.families.flatMap((family) =>
    roles.map((role) => variable(`${family.id}-${role}`, family[role])),
  )
  const syntaxVariables = [
    variable('syntax-punctuation', syntax.punctuation),
    variable('syntax-variable', syntax.variable),
    variable('syntax-keyword', syntax.keyword),
    variable('syntax-function', syntax.function),
    variable('syntax-string', syntax.string),
    variable('syntax-constant', syntax.constant),
    variable('syntax-type', syntax.type),
    variable('syntax-number', syntax.number),
    variable('syntax-comment', syntax.comment),
  ]

  return [
    variable('background', planes.background),
    variable('surface-working', planes.working),
    variable('surface-raised', planes.raised),
    variable('text-primary', ink['text-primary']),
    variable('text-secondary', ink['text-secondary']),
    variable('text-muted', ink['text-muted']),
    variable('line', rules.hairline),
    variable('guide', rules.guide),
    variable('track', rules.track),
  ].concat(familyVariables, syntaxVariables)
}

function rule(selector: string, declarations: readonly string[]) {
  const body = declarations.map((line) => `  ${line}`).join('\n')

  return `${selector} {\n${body}\n}`
}

export const tokensCss = [
  rule(
    ':root, [data-cosmofi-theme="starfield"]',
    themeDeclarations(starfield),
  ),
  rule('[data-cosmofi-theme="daybreak"]', themeDeclarations(daybreak)),
].join('\n\n')
