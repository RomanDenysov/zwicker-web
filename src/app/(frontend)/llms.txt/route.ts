import config from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { getSettings } from '@/Settings/getSettings'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/utilities/siteMeta'

export const runtime = 'nodejs'
// Resolve at request time (DB-backed) and let the CDN cache via Cache-Control below.
export const dynamic = 'force-dynamic'

const publishedWhere = { _status: { equals: 'published' } } as const

export async function GET() {
  const url = getServerSideURL()
  const payload = await getPayload({ config })
  const settings = await getSettings()

  const [pages, rooms, posts, menu] = await Promise.all([
    payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: publishedWhere,
      select: { slug: true, title: true, meta: { description: true } },
    }),
    payload.find({
      collection: 'rooms',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: publishedWhere,
      select: { slug: true, title: true, shortDescription: true, priceFrom: true },
    }),
    payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 100,
      pagination: false,
      sort: '-publishedAt',
      where: publishedWhere,
      select: { slug: true, title: true, meta: { description: true } },
    }),
    payload.findGlobal({ slug: 'daily-menu', depth: 0 }).catch(() => null),
  ])

  const lines: string[] = []
  const push = (...parts: string[]) => lines.push(...(parts.length ? parts : ['']))

  push(`# ${SITE_TITLE}`)
  push()
  push(`> ${settings.siteDescription || SITE_DESCRIPTION}`)
  push()

  // Contact + practical facts up top so an LLM can answer "where / when / how to reach".
  const contact: string[] = []
  const address =
    [settings.streetAddress, settings.postalCode, settings.addressLocality]
      .filter(Boolean)
      .join(', ') || settings.address?.replace(/\n+/g, ', ')
  if (address) contact.push(`- Adresa: ${address}`)
  if (settings.phone) contact.push(`- Telefón: ${settings.phone}`)
  if (settings.email) contact.push(`- E-mail: ${settings.email}`)
  if (settings.servesCuisine) contact.push(`- Kuchyňa: ${settings.servesCuisine}`)
  if (settings.priceRange) contact.push(`- Cenová úroveň: ${settings.priceRange}`)
  if (contact.length) {
    push('## Kontakt')
    push(...contact)
    push()
  }

  const hours = (settings.openingHours || [])
    .filter((row) => row.days && row.hours)
    .map((row) => `- ${row.days}: ${row.hours}`)
  if (hours.length) {
    push('## Otváracie hodiny')
    push(...hours)
    if (settings.closedNote) push(`- ${settings.closedNote}`)
    push()
  }

  const pageLinks = pages.docs
    .filter((p) => p.slug && p.title)
    .map((p) => {
      const path = p.slug === 'home' ? '/' : `/${p.slug}`
      const desc = p.meta?.description ? `: ${p.meta.description}` : ''
      return `- [${p.title}](${url}${path})${desc}`
    })
  if (pageLinks.length) {
    push('## Stránky')
    push(...pageLinks)
    push()
  }

  const roomLinks = rooms.docs
    .filter((r) => r.slug && r.title)
    .map((r) => {
      const price = r.priceFrom ? ` (od ${r.priceFrom} €)` : ''
      const desc = r.shortDescription ? `: ${r.shortDescription}` : ''
      return `- [${r.title}](${url}/izby/${r.slug})${desc}${price}`
    })
  if (roomLinks.length) {
    push('## Ubytovanie')
    push(...roomLinks)
    push()
  }

  const postLinks = posts.docs
    .filter((p) => p.slug && p.title)
    .map((p) => {
      const desc = p.meta?.description ? `: ${p.meta.description}` : ''
      return `- [${p.title}](${url}/posts/${p.slug})${desc}`
    })
  if (postLinks.length) {
    push('## Aktuality')
    push(...postLinks)
    push()
  }

  push('## Rezervácie')
  push(`- Ubytovanie: ${url}/rezervacia`)
  if (settings.phone || settings.email) {
    const via = [settings.phone && `telefonicky na ${settings.phone}`, settings.email && `e-mailom na ${settings.email}`]
      .filter(Boolean)
      .join(' alebo ')
    push(`- Stôl v reštaurácii: ${via}`)
  }
  push()

  const categories = (menu?.categories || []).filter((c) => c.name && c.items?.length)
  if (categories.length) {
    push('## Denné menu')
    for (const category of categories) {
      push(`### ${category.name}`)
      for (const item of category.items || []) {
        if (!item.name) continue
        const price =
          typeof item.price === 'number' ? ` - ${item.price.toString().replace('.', ',')} €` : ''
        const note = item.description?.trim().replace(/^\(|\)$/g, '')
        const desc = note ? ` (${note})` : ''
        push(`- ${item.name}${desc}${price}`)
      }
      push()
    }
  }

  return new Response(lines.join('\n').trim() + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
