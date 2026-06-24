'use client'

import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/utilities/prefersReducedMotion'

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed = 0.25,
  anchor: 'top' | 'center' = 'top',
) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      // top: 0 when the element top meets the viewport top (full-height heros).
      // center: 0 when the element is centered in the viewport (in-page sections),
      // which keeps the drift symmetric so scaled edges never peek into view.
      const viewportH = window.innerHeight || document.documentElement.clientHeight
      const offset =
        anchor === 'center'
          ? (viewportH / 2 - (rect.top + rect.height / 2)) * speed
          : -rect.top * speed
      el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true })
          update()
        } else {
          window.removeEventListener('scroll', onScroll)
        }
      },
      { rootMargin: '50% 0%' },
    )

    io.observe(el)
    update()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed, anchor])

  return ref
}
