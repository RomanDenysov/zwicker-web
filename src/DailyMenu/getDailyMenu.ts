import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

async function getDailyMenuFromDb() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'daily-menu', depth: 1 })
}

export const getDailyMenu = unstable_cache(async () => getDailyMenuFromDb(), ['global_daily-menu'], {
  tags: ['global_daily-menu'],
  revalidate: 3600,
})
