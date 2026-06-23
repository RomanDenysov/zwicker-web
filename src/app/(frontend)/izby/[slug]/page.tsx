import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { HoursStrip } from '@/components/HoursStrip'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { RoomHero } from '@/heros/RoomHero'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import { buildRoomGraph } from '@/utilities/structuredData'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const rooms = await payload.find({
    collection: 'rooms',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return rooms.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function RoomPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/izby/${decodedSlug}`

  const room = await queryRoomBySlug({ slug: decodedSlug })
  if (!room) return <PayloadRedirects url={url} />

  return (
    <article className="pb-24">
      <StructuredData data={buildRoomGraph(room)} />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <RoomHero room={room} />
      <HoursStrip />

      <section className="py-20">
        <div className="container grid gap-16 md:grid-cols-[1.2fr_1fr]">
          <div>
            {room.shortDescription && (
              <p className="text-lg leading-relaxed text-foreground-muted mb-8">
                {room.shortDescription}
              </p>
            )}
            {room.description && <RichText data={room.description} enableGutter={false} />}
            {room.bookingUrl && (
              <a
                href={room.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-10 px-8 py-3 bg-primary hover:bg-primary-light text-white text-label rounded transition-colors"
              >
                Zistiť dostupnosť
              </a>
            )}
          </div>
          {room.amenities && room.amenities.length > 0 && (
            <aside>
              <h3 className="text-label text-foreground-muted mb-5">Vybavenie</h3>
              <table className="w-full border-separate border-spacing-0">
                <tbody>
                  {room.amenities.map((a, i) => (
                    <tr key={i} className={i % 2 === 1 ? 'bg-card' : ''}>
                      <td className="py-3 px-4 font-medium">{a.label}</td>
                      <td className="py-3 px-4 text-right text-foreground-muted">{a.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </aside>
          )}
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const room = await queryRoomBySlug({ slug: decodedSlug })
  return generateMeta({ doc: room, collection: 'rooms' })
}

const queryRoomBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'rooms',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
