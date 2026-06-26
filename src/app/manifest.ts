import type { MetadataRoute } from 'next'
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@/utilities/siteMeta'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: 'sk',
    start_url: '/',
    display: 'standalone',
    background_color: '#1c1c1a',
    theme_color: '#1c1c1a',
    icons: [
      { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { src: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { src: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
  }
}
