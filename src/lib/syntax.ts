import type { ShjTheme } from 'rangi/core'

import { base, familyById } from './theme'

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

export const cosmofiSyntaxTheme = {
  name: 'cosmofi',
  scheme: 'dark',
  bg: '#1A1A1A',
  fg: syntaxColors.variable,
  numbers: syntaxColors.comment,
  tokens: {
    kwd: syntaxColors.keyword,
    func: syntaxColors.function,
    str: syntaxColors.string,
    esc: syntaxColors.string,
    bool: syntaxColors.constant,
    class: syntaxColors.type,
    type: syntaxColors.type,
    num: syntaxColors.number,
    oper: syntaxColors.punctuation,
    bracket: syntaxColors.punctuation,
    cmnt: syntaxColors.comment,
    var: syntaxColors.variable,
    section: syntaxColors.type,
    insert: syntaxColors.constant,
    deleted: syntaxColors.keyword,
    err: syntaxColors.keyword,
  },
} satisfies ShjTheme

export type LanguageId = 'ts' | 'cpp' | 'rs' | 'swift'

export const syntaxRoles = [
  { id: 'punctuation', label: 'Punctuation', family: 'Muted' },
  { id: 'variable', label: 'Variables', family: 'Foreground' },
  { id: 'keyword', label: 'Keywords', family: 'Afterglow' },
  { id: 'function', label: 'Functions', family: 'Halo' },
  { id: 'string', label: 'Strings', family: 'Unripe' },
  { id: 'constant', label: 'Constants', family: 'Life' },
  { id: 'type', label: 'Types / numbers', family: 'Regolith' },
] as const

export type CodeExample = {
  id: LanguageId
  label: string
  name: string
  file: string
  html: string
}
