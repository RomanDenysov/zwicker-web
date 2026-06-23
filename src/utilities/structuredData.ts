import type { Post, Room, Setting } from '@/payload-types'
import { getServerSideURL } from './getURL'
import { getOgImageUrl, getFullImageUrl } from './getOgImageUrl'
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from './siteMeta'

type JsonLd = Record<string, unknown>

const WEEK_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

// Slovak day tokens -> schema.org day. Diacritics kept on purpose so "St" (Streda/Wed)
// and "Št" (Štvrtok/Thu) don't collide.
const SK_DAY_MAP: Record<string, (typeof WEEK_ORDER)[number]> = {
  po: 'Monday',
  pondelok: 'Monday',
  ut: 'Tuesday',
  utorok: 'Tuesday',
  st: 'Wednesday',
  streda: 'Wednesday',
  št: 'Thursday',
  štvrtok: 'Thursday',
  pi: 'Friday',
  piatok: 'Friday',
  so: 'Saturday',
  sobota: 'Saturday',
  ne: 'Sunday',
  nedeľa: 'Sunday',
  nedela: 'Sunday',
}

const normToken = (s: string) => s.toLowerCase().replace(/\./g, '').trim()

const mapDay = (token: string) => {
  const t = normToken(token)
  if (!t) return null
  return SK_DAY_MAP[t] || SK_DAY_MAP[t.slice(0, 2)] || null
}

const parseDays = (input?: string | null): string[] => {
  if (!input) return []
  const out: string[] = []
  for (const chunk of input.split(/[,/]|\ba\b/i)) {
    const range = chunk
      .split(/[-–—]/)
      .map((x) => x.trim())
      .filter(Boolean)
    if (range.length === 2) {
      const a = mapDay(range[0])
      const b = mapDay(range[1])
      const i = a ? WEEK_ORDER.indexOf(a) : -1
      const j = b ? WEEK_ORDER.indexOf(b) : -1
      if (i !== -1 && j !== -1 && i <= j) {
        out.push(...WEEK_ORDER.slice(i, j + 1))
      } else {
        if (a) out.push(a)
        if (b) out.push(b)
      }
    } else {
      const d = mapDay(chunk)
      if (d) out.push(d)
    }
  }
  return [...new Set(out)]
}

const parseHours = (input?: string | null): { opens: string; closes: string } | null => {
  if (!input) return null
  const m = input.match(/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/)
  if (!m) return null
  const pad = (h: string) => h.padStart(2, '0')
  return { opens: `${pad(m[1])}:${m[2]}`, closes: `${pad(m[3])}:${m[4]}` }
}

const buildOpeningHours = (settings: Setting): JsonLd[] => {
  const spec: JsonLd[] = []
  for (const row of settings.openingHours || []) {
    const days = parseDays(row.days)
    const hours = parseHours(row.hours)
    if (!days.length || !hours) continue
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.map((d) => `https://schema.org/${d}`),
      opens: hours.opens,
      closes: hours.closes,
    })
  }
  return spec
}

const buildAddress = (settings: Setting): JsonLd | undefined => {
  const { streetAddress, addressLocality, postalCode, addressRegion, addressCountry, address } =
    settings

  if (streetAddress || addressLocality) {
    return {
      '@type': 'PostalAddress',
      ...(streetAddress ? { streetAddress } : {}),
      ...(addressLocality ? { addressLocality } : {}),
      ...(postalCode ? { postalCode } : {}),
      ...(addressRegion ? { addressRegion } : {}),
      addressCountry: addressCountry || 'SK',
    }
  }
  if (address) {
    return { '@type': 'PostalAddress', streetAddress: address.replace(/\n+/g, ', ') }
  }
  return undefined
}

const buildGeo = (settings: Setting): JsonLd | undefined => {
  const { latitude, longitude } = settings
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return { '@type': 'GeoCoordinates', latitude, longitude }
  }
  return undefined
}

const sameAs = (settings: Setting) =>
  [settings.instagram, settings.facebook].filter((u): u is string => Boolean(u))

/** Shared NAP fields reused by Restaurant + LodgingBusiness nodes. */
const napCore = (settings: Setting): JsonLd => {
  const address = buildAddress(settings)
  const geo = buildGeo(settings)
  const social = sameAs(settings)
  const image = getOgImageUrl(settings.defaultOgImage)
  const openingHours = buildOpeningHours(settings)

  return {
    ...(image ? { image } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(address ? { address } : {}),
    ...(geo ? { geo } : {}),
    ...(settings.googleMapsUrl ? { hasMap: settings.googleMapsUrl } : {}),
    ...(openingHours.length ? { openingHoursSpecification: openingHours } : {}),
    ...(social.length ? { sameAs: social } : {}),
  }
}

/** Root @graph for every front-end page: WebSite + Restaurant + LodgingBusiness. */
export const buildSiteGraph = (settings: Setting): JsonLd => {
  const url = getServerSideURL()
  const description = settings.siteDescription || SITE_DESCRIPTION
  const core = napCore(settings)

  const restaurant: JsonLd = {
    '@type': 'Restaurant',
    '@id': `${url}/#restaurant`,
    name: SITE_NAME,
    description,
    url,
    ...core,
    ...(settings.priceRange ? { priceRange: settings.priceRange } : {}),
    ...(settings.servesCuisine ? { servesCuisine: settings.servesCuisine } : {}),
  }

  const lodging: JsonLd = {
    '@type': 'LodgingBusiness',
    '@id': `${url}/#lodging`,
    name: `Penzión ${SITE_NAME}`,
    description,
    url,
    ...core,
    ...(settings.priceRange ? { priceRange: settings.priceRange } : {}),
  }

  const website: JsonLd = {
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: SITE_TITLE,
    url,
    inLanguage: 'sk-SK',
    publisher: { '@id': `${url}/#restaurant` },
  }

  return { '@context': 'https://schema.org', '@graph': [website, restaurant, lodging] }
}

/** HotelRoom schema for /izby/[slug]. */
export const buildRoomGraph = (room: Room): JsonLd => {
  const url = getServerSideURL()
  const images = [
    getFullImageUrl(room.heroImage),
    ...((room.gallery || []).map((g) => getFullImageUrl(g)) || []),
  ].filter((u): u is string => Boolean(u))

  const offers = room.priceFrom
    ? {
        '@type': 'Offer',
        price: room.priceFrom,
        priceCurrency: 'EUR',
        ...(room.bookingUrl ? { url: room.bookingUrl } : {}),
        availability: 'https://schema.org/InStock',
      }
    : undefined

  const amenities = (room.amenities || [])
    .filter((a) => a.label)
    .map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a.value ? `${a.label}: ${a.value}` : a.label,
      value: true,
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.title,
    url: `${url}/izby/${room.slug}`,
    ...(room.shortDescription ? { description: room.shortDescription } : {}),
    ...(images.length ? { image: images } : {}),
    ...(amenities.length ? { amenityFeature: amenities } : {}),
    ...(offers ? { offers } : {}),
    containedInPlace: {
      '@type': 'LodgingBusiness',
      '@id': `${url}/#lodging`,
      name: `Penzión ${SITE_NAME}`,
    },
  }
}

/** BlogPosting schema for /posts/[slug]. */
export const buildPostGraph = (post: Post): JsonLd => {
  const url = getServerSideURL()
  const image = getFullImageUrl(post.meta?.image) || getFullImageUrl(post.heroImage)
  const authors = (post.populatedAuthors || [])
    .map((a) => a?.name)
    .filter((n): n is string => Boolean(n))
    .map((name) => ({ '@type': 'Person', name }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta?.title || post.title,
    ...(post.meta?.description ? { description: post.meta.description } : {}),
    url: `${url}/posts/${post.slug}`,
    inLanguage: 'sk-SK',
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(image ? { image } : {}),
    ...(authors.length ? { author: authors } : {}),
    mainEntityOfPage: `${url}/posts/${post.slug}`,
    publisher: { '@type': 'Organization', name: SITE_NAME, '@id': `${url}/#restaurant` },
  }
}
