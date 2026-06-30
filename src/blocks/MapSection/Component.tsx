import React from 'react'

import type { MapSectionBlock as MapSectionBlockProps } from '@/payload-types'

import { getSettings } from '@/Settings/getSettings'

function extractIframeSrc(html: string): string | null {
  const match = html.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  return match ? match[1] : null
}

// Build a no-API-key embed src from coordinates (preferred) or a free-text address.
function buildEmbedSrc(googleMapsUrl?: string | null, address?: string | null): string | null {
  const coords = googleMapsUrl?.match(/q=(-?\d+\.\d+,\s*-?\d+\.\d+)/)?.[1]
  const query = coords ?? address?.replace(/\n/g, ', ').trim()
  if (!query) return null
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=sk&output=embed`
}

export const MapSectionBlock: React.FC<MapSectionBlockProps> = async ({
  address,
  embedSource,
  customEmbed,
}) => {
  const settings = await getSettings()
  const raw =
    embedSource === 'custom' && customEmbed ? customEmbed : settings.googleMapsEmbed || ''
  const configured = raw.trim().startsWith('<iframe') ? extractIframeSrc(raw) : raw.trim() || null
  const src = configured ?? buildEmbedSrc(settings.googleMapsUrl, address)

  return (
    <section className="py-20">
      <div className="container">
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
