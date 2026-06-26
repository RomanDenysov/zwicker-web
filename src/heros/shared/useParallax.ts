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

    // Measure the untransformed parent frame, never `el` itself: `el` carries the
    // parallax transform, so reading its rect feeds the offset back into its own
    // input. Off-screen at mount that produced a huge offset that translated the
    // image out of its `overflow:hidden` frame — and because the displaced wrap
    // was then clipped, observing it left the IO permanently non-intersecting, so
    // the offset never got corrected (image stayed blank until a remount).
    const frame = el.parentElement ?? el

    let raf = 0

    const update = () => {
      raf = 0
      const rect = frame.getBoundingClientRect()
      // top: 0 when the frame top meets the viewport top (full-height heros).
      // center: 0 when the frame is centered in the viewport (in-page sections),
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
          // Promote to a composited layer only while in view; a stuck
          // `will-change` layer breaks lazy-loading/repaints for off-screen images.
          el.style.willChange = 'transform'
          window.addEventListener('scroll', onScroll, { passive: true })
          update()
        } else {
          el.style.willChange = ''
          window.removeEventListener('scroll', onScroll)
        }
      },
      { rootMargin: '50% 0%' },
    )

    io.observe(frame)
    update()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      el.style.willChange = ''
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed, anchor])

  return ref
}
