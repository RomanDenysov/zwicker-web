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
        <StructuredData data={buildSiteGraph(settings)} />
      </head>
      <body
        style={
          {
            '--header-height': 'calc(var(--spacing) * 16)',
          } as React.CSSProperties
        }
      >
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
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: mergeOpenGraph({ description }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
