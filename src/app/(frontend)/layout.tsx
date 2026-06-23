import type { Metadata, Viewport } from 'next'

import React from 'react'

import { fontVariables } from './fonts'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { StructuredData } from '@/components/StructuredData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getSettings } from '@/Settings/getSettings'
import { buildSiteGraph } from '@/utilities/structuredData'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/utilities/siteMeta'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getSettings()

  return (
    <html className={fontVariables} lang="sk" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <StructuredData data={buildSiteGraph(settings)} />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  themeColor: '#1c1c1a',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const description = settings.siteDescription || SITE_DESCRIPTION

  return {
    metadataBase: new URL(getServerSideURL()),
    title: SITE_TITLE,
    description,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/favicon.svg',
    },
    openGraph: mergeOpenGraph({ description }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
