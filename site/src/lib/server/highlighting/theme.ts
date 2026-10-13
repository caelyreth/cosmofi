import { surfaces, syntaxColors } from 'cosmofi'
import type { ShjTheme } from 'rangi/core'

export const cosmofiSyntaxTheme = {
  name: 'cosmofi',
  scheme: 'dark',
  bg: surfaces.working,
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
