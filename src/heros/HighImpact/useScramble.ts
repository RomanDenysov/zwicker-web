'use client'

import { useEffect, useState } from 'react'

import { prefersReducedMotion } from '@/utilities/prefersReducedMotion'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ©'

const randomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)]

type Options = {
  /** Ms between scramble ticks (each tick reshuffles unlocked positions). */
  tickMs?: number
  /** Delay before the first character locks. */
  initialDelay?: number
  /** Min ms before next character locks after the previous one. */
  minStep?: number
  /** Max ms before next character locks after the previous one. */
  maxStep?: number
}

/**
 * Progressively reveals `target` by scrambling unlocked positions and
 * locking one character at a time, left to right. Each lock uses a
 * randomized delay so letters resolve with uneven timing while still
 * respecting left-to-right order. Respects `prefers-reduced-motion`.
 */
export function useScramble(
  target: string,
  { tickMs = 90, initialDelay = 600, minStep = 330, maxStep = 780 }: Options = {},
) {
  const [display, setDisplay] = useState<string[]>(() => Array.from(target))

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(Array.from(target))
      return
    }

    const chars = Array.from(target)
    setDisplay(Array.from(target, () => randomChar()))
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let locked = 0
    let cumulative = initialDelay

    // Compute a monotonic lock schedule with randomized per-letter gaps.
    for (let i = 0; i < chars.length; i++) {
      const fireAt = cumulative
      timeouts.push(
        setTimeout(() => {
          locked = i + 1
          if (locked >= chars.length) {
            setDisplay(chars)
          }
        }, fireAt),
      )
      cumulative += minStep + Math.random() * (maxStep - minStep)
    }

    const tick = setInterval(() => {
      setDisplay((current) => current.map((_, i) => (i < locked ? chars[i] : randomChar())))
    }, tickMs)

    const stopAt = cumulative + tickMs
    const stopper = setTimeout(() => clearInterval(tick), stopAt)

    return () => {
      timeouts.forEach(clearTimeout)
      clearTimeout(stopper)
      clearInterval(tick)
    }
  }, [target, tickMs, initialDelay, minStep, maxStep])

  return display
}
