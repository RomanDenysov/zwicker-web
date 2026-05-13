'use client'

import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { useDarkTheme } from '@/heros/shared/useDarkTheme'
import { prefersReducedMotion } from '@/utilities/prefersReducedMotion'

const LETTERS = ['Z', 'W', 'I', 'C', 'K', 'E', 'R'] as const

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const [morphed, setMorphed] = useState(false)
  useDarkTheme()

  useEffect(() => {
    if (prefersReducedMotion()) {
      setMorphed(true)
      return
    }
    const t = setTimeout(() => setMorphed(true), 750)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      data-theme="dark"
      className="relative h-screen -mt-16 flex items-center justify-center overflow-hidden text-white text-center"
    >
      {media && typeof media === 'object' && (
        <ParallaxMedia
          resource={media}
          imgClassName="object-cover brightness-[0.35] saturate-[0.7]"
          speed={0.35}
        />
      )}
      <div className="relative z-10 px-4">
        <div
          aria-label="Zwicker"
          data-morphed={morphed}
          className="brand-morph mb-6 font-extralight leading-none tabular-nums"
        >
          {LETTERS.map((char, i) => {
            const collapses = char === 'I' || char === 'E'
            if (char === 'C') {
              return (
                <span key={i} className="brand-letter brand-c" aria-hidden="true">
                  <span className="brand-c-original">C</span>
                  <span className="brand-c-mark copy-mark">©</span>
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
        </div>
        {richText && (
          <div
            className="animate-fade-up opacity-0"
            style={{ animationDelay: '2.2s', animationFillMode: 'forwards' }}
          >
            <RichText data={richText} enableGutter={false} className="prose-invert max-w-xl mx-auto" />
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
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/35 animate-fade-up opacity-0"
        style={{ animationDelay: '2.6s', animationFillMode: 'forwards' }}
      >
        Scroll
        <span className="w-px h-10 bg-white/20 animate-pulse" />
      </div>
    </section>
  )
}
