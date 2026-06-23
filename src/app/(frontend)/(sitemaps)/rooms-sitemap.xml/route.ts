import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'

const getRoomsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'rooms',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    return results.docs
      ? results.docs
          .filter((room) => Boolean(room?.slug))
          .map((room) => ({
            loc: `${SITE_URL}/izby/${room?.slug}`,
            lastmod: room.updatedAt || dateFallback,
          }))
      : []
  },
  ['rooms-sitemap'],
  {
    tags: ['rooms-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getRoomsSitemap()

  return getServerSideSitemap(sitemap)
}
