import { createLocalReq, getPayload } from 'payload'

import config from '@payload-config'

import { seed } from '../src/endpoints/seed'

/**
 * Standalone seed runner — no HTTP login required.
 * Run with: `pnpm seed` (wraps `payload run`, which loads env + the @payload-config alias).
 */
const run = async () => {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  await seed({ payload, req })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
