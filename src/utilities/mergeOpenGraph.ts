import type { Metadata } from 'next'
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from './siteMeta'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'sk_SK',
  description: SITE_DESCRIPTION,
  siteName: SITE_NAME,
  title: SITE_TITLE,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
