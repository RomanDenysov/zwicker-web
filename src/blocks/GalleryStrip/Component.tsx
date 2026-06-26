import React from 'react'

import type { GalleryStripBlock as GalleryStripBlockProps, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const speeds = { slow: '60s', normal: '35s', fast: '20s' }

const backgrounds: Record<string, string> = {
  default: '',
  warm: 'bg-background-warm',
  brown: 'bg-background-brown',
}

// Fixed slots for the loose collage (first 5 images map into these).
// Each pairs a column-span with an aspect ratio for a staggered, editorial feel.
const collageSlots = [
  'col-span-7 aspect-[4/3]',
  'col-span-5 aspect-[3/4]',
  'col-span-5 aspect-square',
  'col-span-7 aspect-[16/10]',
  'col-span-12 aspect-[21/9]',
]

export const GalleryStripBlock: React.FC<GalleryStripBlockProps> = ({
  images,
  variant,
  background,
  scrollSpeed,
}) => {
  const items = (images || []).filter((i): i is MediaType => typeof i === 'object')
  if (!items.length) return null

  const bg = backgrounds[background || 'default']
  const isBrown = background === 'brown'

  if (variant === 'collage') {
    const slotted = items.slice(0, collageSlots.length)
    return (
      <section className={cn('py-28', bg)} {...(isBrown ? { 'data-theme': 'dark' } : {})}>
        {/* Edge-to-edge collage: only the gap-sized gutter at the viewport edges. */}
        <div className="grid grid-cols-12 gap-3 md:gap-4 px-3 md:px-4">
          {slotted.map((img, i) => (
            <div key={img.id} className={cn('overflow-hidden rounded', collageSlots[i])}>
              <Media
                resource={img}
                size="(max-width: 768px) 100vw, 50vw"
                // Top row (first 2 slots) loads eagerly; sync decode for a crisp, all-at-once paint.
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="sync"
                imgClassName="w-full h-full object-cover transform-gpu saturate-[0.85] hover:saturate-100 hover:scale-[1.03] transition-[transform,scale,filter] duration-500 ease-smooth"
              />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // scroll variant — duplicate the array for seamless infinite scroll.
  // The second half is visual-only; screen readers skip it.
  const loop = [...items, ...items]
  const originalLen = items.length

  return (
    <section
      className={cn('py-28 overflow-hidden', bg)}
      {...(isBrown ? { 'data-theme': 'dark' } : {})}
    >
      <div
        className="flex gap-3 animate-[gallerySlide_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: speeds[scrollSpeed || 'normal'] }}
      >
        {loop.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            aria-hidden={i >= originalLen ? 'true' : undefined}
            className="shrink-0 w-[420px] h-[300px]"
          >
            <Media
              resource={img}
              size="420px"
              // First few tiles are visible before the marquee scrolls; load them eagerly.
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="sync"
              imgClassName="w-full h-full object-cover rounded saturate-[0.8] hover:saturate-100 transition-[filter] duration-500 ease-smooth"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
