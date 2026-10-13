import { roles, type Theme } from 'cosmofi'

export function siteStyle(theme: Theme) {
  const familyVariables = theme.families.flatMap((family) =>
    roles.map((role) => `--${family.id}-${role}:${family[role]}`),
  )
  const syntaxVariables = [
    `--syntax-punctuation:${theme.syntaxColors.punctuation}`,
    `--syntax-variable:${theme.syntaxColors.variable}`,
    `--syntax-keyword:${theme.syntaxColors.keyword}`,
    `--syntax-function:${theme.syntaxColors.function}`,
    `--syntax-string:${theme.syntaxColors.string}`,
    `--syntax-constant:${theme.syntaxColors.constant}`,
    `--syntax-type:${theme.syntaxColors.type}`,
    `--syntax-number:${theme.syntaxColors.number}`,
    `--syntax-comment:${theme.syntaxColors.comment}`,
  ]

  return [
    `--page:${theme.surfaces.background}`,
    `--panel:${theme.surfaces.working}`,
    `--raised:${theme.surfaces.raised}`,
    `--ink:${theme.base['text-primary']}`,
    `--secondary:${theme.base['text-secondary']}`,
    `--muted:${theme.base['text-muted']}`,
    `--line:${theme.lines.hairline}`,
    `--guide:${theme.lines.guide}`,
    `--track:${theme.lines.track}`,
  ]
    .concat(familyVariables, syntaxVariables)
    .join(';')
}
