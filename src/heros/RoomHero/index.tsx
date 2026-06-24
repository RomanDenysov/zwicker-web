'use client'

import React from 'react'

import type { Room } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { useDarkTheme } from '@/heros/shared/useDarkTheme'

export const RoomHero: React.FC<{ room: Room }> = ({ room }) => {
  useDarkTheme()

  return (
    <section
      data-theme="dark"
      className="relative h-[400px] -mt-[var(--header-height)] flex items-center justify-center overflow-hidden text-white text-center"
    >
      {room.heroImage && typeof room.heroImage === 'object' && (
        <ParallaxMedia
          resource={room.heroImage}
          imgClassName="object-cover brightness-[0.4] saturate-[0.75]"
          speed={0.3}
        />
      )}
      <div className="relative z-10 container">
        <p className="text-label text-white/60 mb-3">Ubytovanie</p>
        <h1 className="text-h1">{room.title}</h1>
        <p className="text-primary-light mt-4">Od {room.priceFrom} € / noc</p>
        {room.bookingUrl && (
          <div className="mt-8">
            <CMSLink
              type="custom"
              url={room.bookingUrl}
              newTab
              label="Rezervovať izbu"
              appearance="default"
              size="lg"
            />
          </div>
        )}
      </div>
    </section>
  )
}
