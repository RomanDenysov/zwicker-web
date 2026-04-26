'use client'

import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/utilities/prefersReducedMotion'

export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.25) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const offset = -rect.top * speed
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
  }, [speed])

  return ref
}
