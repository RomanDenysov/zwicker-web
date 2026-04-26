import Link from 'next/link'
import React from 'react'

import type { Room, RoomsGridBlock as RoomsGridBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const RoomsGridBlock: React.FC<RoomsGridBlockProps> = ({
  sectionLabel,
  heading,
  body,
  rooms,
  links,
}) => {
  const populated = (rooms || []).filter((r): r is Room => typeof r === 'object')
  if (!populated.length) return null

  return (
    <section className="py-28">
      <div className="container">
        <div className="mb-12">
          {sectionLabel && <div className="section-label">{sectionLabel}</div>}
          {heading && <h2 className="text-h1">{heading}</h2>}
          {body && (
            <p className="text-sm text-foreground-muted mt-3 max-w-lg">{body}</p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {populated.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        {links && links.length > 0 && (
          <div className="flex justify-center mt-10">
            {links.map((item, i) => (
              <CMSLink key={item.id ?? i} {...item.link} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      href={`/izby/${room.slug}`}
      className="group relative block overflow-hidden rounded cursor-pointer"
    >
      {room.heroImage && typeof room.heroImage === 'object' && (
        <Media
          resource={room.heroImage}
          imgClassName="w-full h-[360px] object-cover saturate-[0.8] group-hover:saturate-[0.95] group-hover:scale-[1.04] transition-[transform,filter] duration-700"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-7 text-white">
        <h3 className="text-lg font-medium">{room.title}</h3>
        <div className="text-sm text-primary-light mt-1">
          Od {room.priceFrom} € / noc
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex gap-3 mt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            {room.amenities.slice(0, 4).map((a, i) => (
              <span key={a.id ?? i} className="text-[0.6rem] tracking-wide uppercase text-white/60">
                {a.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
