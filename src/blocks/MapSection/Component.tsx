import React from 'react'

import type { MapSectionBlock as MapSectionBlockProps } from '@/payload-types'

import { getSettings } from '@/Settings/getSettings'

function extractIframeSrc(html: string): string | null {
  const match = html.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  return match ? match[1] : null
}

export const MapSectionBlock: React.FC<MapSectionBlockProps> = async ({
  sectionLabel,
  address,
  embedSource,
  customEmbed,
}) => {
  const raw =
    embedSource === 'custom' && customEmbed
      ? customEmbed
      : (await getSettings()).googleMapsEmbed || ''
  const src = raw.trim().startsWith('<iframe') ? extractIframeSrc(raw) : raw.trim() || null

  return (
    <section className="py-20">
      <div className="container">
        {sectionLabel && <div className="section-label mb-8">{sectionLabel}</div>}
        <div className="w-full h-[400px] bg-background-muted rounded overflow-hidden">
          {src ? (
            <iframe
              title="Mapa"
              src={src}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-muted">
              Google Maps
            </div>
          )}
        </div>
        {address && (
          <p className="text-sm text-foreground-muted mt-6 whitespace-pre-line">{address}</p>
        )}
      </div>
    </section>
  )
}
