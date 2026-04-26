import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

async function getSettingsFromDb() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings', depth: 2 })
  return settings
}

export const getSettings = unstable_cache(async () => getSettingsFromDb(), ['global_settings'], {
  tags: ['global_settings'],
  revalidate: 3600,
})
