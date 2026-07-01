'use client'

import React, { useEffect, useRef, useState } from 'react'

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Stagger the direct children in instead of revealing the wrapper as one unit. */
  stagger?: boolean
  /** Re-hide when scrolled back out of view. Default reveals once and stays. */
  repeat?: boolean
}

/**
 * Scroll-triggered reveal. The wrapper (or its direct children, when `stagger`)
 * fades + lifts into place the first time it enters the viewport.
 *
 * Motion lives entirely in CSS (`[data-reveal]` rules in globals.css) using the
 * independent `translate` property so it never overrides Tailwind transforms.
 * The hidden state only exists under `prefers-reduced-motion: no-preference`, so
 * reduced-motion users get fully-visible content with no JS dependency.
 */
export const Reveal: React.FC<RevealProps> = ({
  stagger = false,
  repeat = false,
  className,
  children,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (!repeat) observer.disconnect()
        } else if (repeat) {
          setRevealed(false)
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [repeat])

  return (
    <div
      ref={ref}
      data-reveal={stagger ? 'group' : 'item'}
      data-revealed={revealed}
      className={className}
      {...rest}
    >
      {children}
    </div>
  )
}
