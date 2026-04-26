import React from 'react'

import type { GalleryStripBlock as GalleryStripBlockProps, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

const speeds = { slow: '60s', normal: '35s', fast: '20s' }

export const GalleryStripBlock: React.FC<GalleryStripBlockProps> = ({
  sectionLabel,
  images,
  scrollSpeed,
}) => {
  const items = (images || []).filter((i): i is MediaType => typeof i === 'object')
  if (!items.length) return null

  // Duplicate the array for seamless infinite scroll.
  // The second half is visual-only; screen readers skip it.
  const loop = [...items, ...items]
  const originalLen = items.length

  return (
    <section className="py-28 overflow-hidden">
      {sectionLabel && <div className="container section-label mb-10">{sectionLabel}</div>}
      <div
        className="flex gap-3 animate-[gallerySlide_linear_infinite] hover:[animation-play-state:paused]"
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
              imgClassName="w-full h-full object-cover rounded saturate-[0.8] hover:saturate-100 transition-[filter]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
