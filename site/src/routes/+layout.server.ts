import type { ThemeId } from 'cosmofi'

import type { LayoutServerLoad } from './$types'

export const load = (({ cookies }) => {
  const saved = cookies.get('cosmofi-theme')
  const theme: ThemeId = saved === 'daybreak' ? 'daybreak' : 'starfield'

  return { theme }
}) satisfies LayoutServerLoad
