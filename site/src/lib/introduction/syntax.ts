import type { syntaxColors } from 'cosmofi-starfield'

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
