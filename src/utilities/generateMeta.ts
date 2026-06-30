import type { Metadata } from 'next'

import type { Page, Post, Room } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getOgImageUrl } from './getOgImageUrl'
import { getSettings } from '@/Settings/getSettings'
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, TITLE_SUFFIX } from './siteMeta'

type Collection = 'pages' | 'posts' | 'rooms'

const pathFor = (collection: Collection, slug?: string | null): string => {
  if (!slug || slug === 'home') return '/'
  if (collection === 'posts') return `/posts/${slug}`
  if (collection === 'rooms') return `/izby/${slug}`
  return `/${slug}`
}

const titleFor = (rawTitle?: string | null): string => {
  const title = rawTitle?.trim()
  if (!title) return SITE_TITLE
  return title.includes(SITE_NAME) ? title : `${title}${TITLE_SUFFIX}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Room> | null
  collection?: Collection
}): Promise<Metadata> => {
  const { doc, collection = 'pages' } = args
  const settings = await getSettings()
  const serverUrl = getServerSideURL()

  const ogImage = getOgImageUrl(doc?.meta?.image) || getOgImageUrl(settings.defaultOgImage)
  const title = titleFor(doc?.meta?.title)
  const description = doc?.meta?.description || settings.siteDescription || SITE_DESCRIPTION
  const pathname = pathFor(collection, doc?.slug)

  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: mergeOpenGraph({
      type: collection === 'posts' ? 'article' : 'website',
      title,
      description,
      url: serverUrl + pathname,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    }),
  }
}
