'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { useDarkTheme } from '@/heros/shared/useDarkTheme'

import { useScramble } from './useScramble'

const BRAND = 'ZW©KR'
const BRAND_CHARS = Array.from(BRAND)

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const letters = useScramble(BRAND)
  useDarkTheme()

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
        <div className="flex items-center justify-center gap-[clamp(0.6rem,2vw,2.5rem)] mb-6 font-extralight leading-none tabular-nums">
          {letters.map((char, i) => {
            const isMarkPosition = BRAND_CHARS[i] === '©'
            return (
              <span
                key={i}
                className={char === '©' ? 'copy-mark' : undefined}
                style={{
                  fontSize: isMarkPosition ? 'clamp(3rem,8vw,8.5rem)' : 'clamp(4rem,10vw,11rem)',
                  letterSpacing: '0.05em',
                  minWidth: '0.6em',
                }}
              >
                {char}
              </span>
            )
          })}
        </div>
        {richText && (
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}>
            <RichText data={richText} enableGutter={false} className="prose-invert max-w-xl mx-auto" />
          </div>
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul
            className="flex justify-center gap-4 mt-10 animate-fade-up opacity-0"
            style={{ animationDelay: '3.7s', animationFillMode: 'forwards' }}
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
        style={{ animationDelay: '3.9s', animationFillMode: 'forwards' }}
      >
        Scroll
        <span className="w-px h-10 bg-white/20 animate-pulse" />
      </div>
    </section>
  )
}
