import { codeExamples } from '#lib/server/highlighting/examples'

import type { PageServerLoad } from './$types'

export const load = (() => {
  return { examples: codeExamples }
}) satisfies PageServerLoad
