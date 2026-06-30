import React from 'react'

import type { GalleryStripBlock as GalleryStripBlockProps, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/utilities/ui'

import { ScrollGallery } from './ScrollGallery'

const backgrounds: Record<string, string> = {
  default: '',
  warm: 'bg-background-warm',
  brown: 'bg-background-brown',
}

// Loose editorial collage (first 5 images map into these slots).
// Desktop places each image into a 12x12 grid with deliberate gaps and
// staggered rows so the photos "float" with whitespace around them.
const collageSlots: React.CSSProperties[] = [
  { gridColumn: '1 / span 4', gridRow: '2 / span 6' }, // left, portrait
  { gridColumn: '5 / span 4', gridRow: '1 / span 6' }, // center, sits highest
  { gridColumn: '9 / span 4', gridRow: '2 / span 5' }, // right
  { gridColumn: '2 / span 5', gridRow: '8 / span 5' }, // lower left, portrait
  { gridColumn: '7 / span 5', gridRow: '7 / span 5' }, // lower right, wide
]

const collageImgClassName =
  'object-cover transform-gpu saturate-[0.85] hover:saturate-100 hover:scale-[1.03] transition-[transform,scale,filter] duration-500 ease-smooth'

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
      <section className={cn('py-20 md:py-28', bg)} {...(isBrown ? { 'data-theme': 'dark' } : {})}>
        <div className="container">
          {/* Mobile: cards stack and overlap each other as you scroll. */}
          <div className="md:hidden">
            {slotted.map((img, i) => (
              <div
                key={img.id}
                className="sticky"
                style={{ top: `calc(var(--header-height) + ${i * 0.625}rem)` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded shadow-[0_-12px_32px_-10px_rgba(20,16,10,0.35)]">
                  <Media
                    resource={img}
                    fill
                    size="100vw"
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="sync"
                    imgClassName="object-cover saturate-[0.85]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: loose scattered collage with whitespace. Each photo floats
              in on its own as the collage scrolls into view. */}
          <Reveal
            stagger
            className="hidden md:grid gap-y-8 gap-x-10 lg:gap-x-16"
            style={{
              gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(12, minmax(0, 1fr))',
              aspectRatio: '1006 / 700',
            }}
          >
            {slotted.map((img, i) => (
              <div key={img.id} className="relative overflow-hidden rounded" style={collageSlots[i]}>
                <Media
                  resource={img}
                  fill
                  size="33vw"
                  // Top-row slots load eagerly; sync decode for a crisp, all-at-once paint.
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="sync"
                  imgClassName={collageImgClassName}
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    )
  }

  // scroll variant — Embla carousel: continuous auto-scroll + touch/mouse drag.
  return (
    <section
      className={cn('pt-16 pb-12 md:pt-28 md:pb-44', bg)}
      {...(isBrown ? { 'data-theme': 'dark' } : {})}
    >
      <ScrollGallery items={items} scrollSpeed={scrollSpeed} />
    </section>
  )
}
