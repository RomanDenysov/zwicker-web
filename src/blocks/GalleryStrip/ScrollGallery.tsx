'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

// Continuous auto-scroll speeds (px/frame-ish), tuned to feel close to the
// previous CSS marquee durations (slow ≈ 60s, normal ≈ 35s, fast ≈ 20s).
const speeds = { slow: 0.6, normal: 1, fast: 1.8 }

type Props = {
  items: MediaType[]
  scrollSpeed?: 'slow' | 'normal' | 'fast' | null
}

export const ScrollGallery: React.FC<Props> = ({ items, scrollSpeed }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start' }, [
    AutoScroll({
      playOnInit: !prefersReducedMotion,
      speed: speeds[scrollSpeed || 'normal'],
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ])

  // Embla's loop needs the track to comfortably exceed the viewport, otherwise
  // it gaps/stutters at the seam. With only a handful of photos, repeat the set
  // so the marquee always flows infinitely.
  const slides = items.length < 8 ? [...items, ...items] : items

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
      {/* Slide spacing is baked into each slide as `pl-3` (offset by the
          container's `-ml-3`), not a container `gap`. Embla folds that padding
          into each slide's measured width, so the loop seam keeps an even gap
          instead of butting the wrapped first/last images together. */}
      <div className="flex touch-pan-y -ml-3">
        {slides.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            aria-hidden={i >= items.length ? 'true' : undefined}
            className="shrink-0 pl-3"
          >
            <div className="relative w-[280px] sm:w-[360px] lg:w-[420px] aspect-[7/5] overflow-hidden rounded">
              <Media
                resource={img}
                fill
                size="(min-width: 1024px) 420px, (min-width: 640px) 360px, 280px"
                loading={i < 3 ? 'eager' : 'lazy'}
                decoding="sync"
                imgClassName="object-cover pointer-events-none select-none saturate-[0.8] transition-[filter] duration-500 ease-smooth"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
