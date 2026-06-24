import Link from 'next/link'
import React from 'react'

import type { Room, RoomsGridBlock as RoomsGridBlockProps } from '@/payload-types'

import { Container, contentWidth } from '@/components/Container'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const RoomsGridBlock: React.FC<RoomsGridBlockProps> = ({
  heading,
  body,
  rooms,
  links,
}) => {
  const populated = (rooms || []).filter((r): r is Room => typeof r === 'object')
  if (!populated.length) return null

  return (
    <section data-theme="dark" className="py-28 bg-background-brown text-dark-foreground">
      <Container>
        <div className={cn('mb-12', contentWidth.narrow)}>
          {heading && (
            <h2 className="text-h1 text-foreground-sage tracking-[0.01em] uppercase font-extralight">
              {heading}
            </h2>
          )}
          {body && (
            <p className="text-sm text-foreground-sage/80 mt-4 leading-[1.7]">{body}</p>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {populated.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        {links && links.length > 0 && (
          <div className="flex justify-center mt-12">
            {links.map((item, i) => (
              <CMSLink key={item.id ?? i} {...item.link} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      href={`/izby/${room.slug}`}
      className="group relative block overflow-hidden rounded h-[420px] cursor-pointer"
    >
      {room.heroImage && typeof room.heroImage === 'object' && (
        <Media
          resource={room.heroImage}
          imgClassName="w-full h-full object-cover saturate-[0.8] group-hover:saturate-[0.95] group-hover:scale-[1.04] transition-[transform,filter] duration-700"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 text-dark-foreground">
        <h3 className="text-[1.125rem] font-medium uppercase tracking-[0.02em] leading-tight">
          {room.title}
        </h3>
        <div className="text-[0.8125rem] tracking-[0.04em] text-dark-foreground/60 mt-2.5">
          Od {room.priceFrom} € / noc
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex gap-4 mt-4">
            {room.amenities.slice(0, 4).map((a, i) => (
              <span
                key={a.id ?? i}
                className="text-[0.625rem] tracking-[0.05em] text-dark-foreground/40"
              >
                {a.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
