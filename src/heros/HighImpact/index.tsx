'use client'

import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { BrandMark } from '@/components/Logo/BrandMark'
import RichText from '@/components/RichText'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { useDarkTheme } from '@/heros/shared/useDarkTheme'
import { prefersReducedMotion } from '@/utilities/prefersReducedMotion'

const LETTERS = ['Z', 'W', 'I', 'C', 'K', 'E', 'R'] as const

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const [morphed, setMorphed] = useState(false)
  useDarkTheme()

  useEffect(() => {
    // Reduced motion skips the hold; the global reduced-motion CSS makes the
    // morph transition instant, so 0ms lands directly on the final state.
    const t = setTimeout(() => setMorphed(true), prefersReducedMotion() ? 0 : 750)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      data-theme="dark"
      className="relative h-screen -mt-[var(--header-height)] flex items-center justify-center overflow-hidden bg-black text-dark-foreground-soft text-center"
    >
      {media && typeof media === 'object' && (
        <ParallaxMedia
          resource={media}
          imgClassName="object-cover brightness-[0.55] saturate-[0.85]"
          speed={0.35}
          priority
          sizes="100vw"
          // The photo is crushed by brightness(0.55) + overlays, so lower quality
          // is imperceptible but meaningfully cuts LCP bytes.
          quality={65}
        />
      )}
      <div
        className="absolute inset-0 bg-ink-900/12 pointer-events-none"
        style={{ backgroundColor: 'rgba(28,28,26,0.12)' }}
      />
      {/* Photo emerges from black on load (also hides the image blur-placeholder flash).
          CSS-driven so the dissolve starts at first paint instead of waiting for
          hydration - otherwise the hero stays black until the JS bundle runs, which
          tanks Speed Index on slow devices. */}
      <div aria-hidden className="hero-reveal absolute inset-0 z-[1] bg-black pointer-events-none" />
      <div className="relative z-10 px-4">
        <h1 className="mb-6">
          <span className="sr-only">Zwicker - Reštaurácia a penzión</span>
          <span
            aria-hidden="true"
            data-morphed={morphed}
            className="brand-morph block font-extralight leading-none tabular-nums"
          >
            {LETTERS.map((char, i) => {
              const collapses = char === 'I' || char === 'E'
              if (char === 'C') {
                return (
                  <span key={i} className="brand-letter brand-c" aria-hidden="true">
                    <span className="brand-c-original">C</span>
                    <span className="brand-c-mark copy-mark">
                      <BrandMark />
                    </span>
                  </span>
                )
              }
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`brand-letter${collapses ? ' brand-collapse' : ''}`}
                >
                  {char}
                </span>
              )
            })}
          </span>
        </h1>
        {richText && (
          <div
            className="animate-fade-up opacity-0"
            style={{ animationDelay: '2.2s', animationFillMode: 'forwards' }}
          >
            <RichText
              data={richText}
              enableGutter={false}
              className="prose-invert max-w-xl mx-auto"
            />
          </div>
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul
            className="flex justify-center gap-4 mt-10 animate-fade-up opacity-0"
            style={{ animationDelay: '2.4s', animationFillMode: 'forwards' }}
          >
            {links.map(({ link }, i) => (
              <li key={i}>
                <CMSLink {...link} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
