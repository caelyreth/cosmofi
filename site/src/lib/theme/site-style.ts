import { base, families, roles, surfaces } from 'cosmofi-starfield'

const familyVariables = families.flatMap((family) =>
  roles.map((role) => `--${family.id}-${role}:${family[role]}`),
)

export const siteStyle = [
  `--page:${base.background}`,
  `--panel:${surfaces.working}`,
  `--ink:${base['text-primary']}`,
  `--secondary:${base['text-secondary']}`,
]
  .concat(familyVariables)
  .join(';')
