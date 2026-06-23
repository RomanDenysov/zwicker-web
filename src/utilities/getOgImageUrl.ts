import type { Media } from '@/payload-types'
import { getServerSideURL } from './getURL'

type MaybeMedia = Media | number | string | null | undefined

/** Absolute URL for an OG/social image (prefers the cropped 1200x630 `og` size). */
export const getOgImageUrl = (media: MaybeMedia): string | undefined => {
  if (media && typeof media === 'object' && 'url' in media && media.url) {
    const ogUrl = media.sizes?.og?.url
    return getServerSideURL() + (ogUrl || media.url)
  }
  return undefined
}

/** Absolute URL for a content image (full size, no social crop). */
export const getFullImageUrl = (media: MaybeMedia): string | undefined => {
  if (media && typeof media === 'object' && 'url' in media && media.url) {
    return getServerSideURL() + media.url
  }
  return undefined
}
