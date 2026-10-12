import { base, familyById } from '#lib/theme/palette'

export const syntaxColors = {
  punctuation: base['text-muted'],
  variable: base['text-primary'],
  keyword: familyById.afterglow.foreground,
  function: familyById.halo.foreground,
  string: familyById.unripe.foreground,
  constant: familyById.life.emphasis,
  type: familyById.regolith.foreground,
  number: familyById.regolith.foreground,
  comment: base['text-secondary'],
} as const

export const syntaxRoles = [
  { id: 'punctuation', label: 'Punctuation', family: 'Muted' },
  { id: 'variable', label: 'Variables', family: 'Foreground' },
  { id: 'keyword', label: 'Keywords', family: 'Afterglow' },
  { id: 'function', label: 'Functions', family: 'Halo' },
  { id: 'string', label: 'Strings', family: 'Unripe' },
  { id: 'constant', label: 'Constants', family: 'Life' },
  { id: 'type', label: 'Types / numbers', family: 'Regolith' },
] as const satisfies readonly {
  readonly id: keyof typeof syntaxColors
  readonly label: string
  readonly family: string
}[]
