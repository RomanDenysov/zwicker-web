'use client'

import React, { useEffect, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

import { useParallax } from './useParallax'

type Props = {
  resource: MediaType
  imgClassName?: string
  speed?: number
  priority?: boolean
  anchor?: 'top' | 'center'
  sizes?: string
}

export const ParallaxMedia: React.FC<Props> = ({
  resource,
  imgClassName,
  speed,
  // Safe default: lazy-load. Only LCP heros should opt into `priority`
  // (which adds fetchpriority="high" + a preload link).
  priority = false,
  anchor = 'top',
  sizes,
}) => {
  const ref = useParallax<HTMLDivElement>(speed, anchor)

  // Native lazy-loading is unreliable for an <img> nested inside a transformed
  // (`scale`) / `will-change` ancestor like the parallax wrapper: the browser
  // can miss it entering the viewport and leave it blank until a reload. For
  // non-priority images we watch the wrapper ourselves and upgrade to eager
  // once it's near, instead of trusting the native heuristic.
  const [eager, setEager] = useState(false)

  useEffect(() => {
    if (priority || eager) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEager(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [priority, eager, ref])

  return (
    <div ref={ref} className="parallax-wrap absolute inset-0">
      <Media
        // Remount when we upgrade to eager. Flipping `loading` on an <img> the
        // browser has already deferred inside a composited (`will-change`) layer
        // doesn't restart the fetch; a freshly mounted eager element loads at once.
        key={eager ? 'eager' : 'lazy'}
        fill
        priority={priority}
        loading={priority ? undefined : eager ? 'eager' : 'lazy'}
        size={sizes}
        resource={resource}
        imgClassName={imgClassName}
      />
    </div>
  )
}
