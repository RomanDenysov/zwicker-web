'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { useDarkTheme } from '@/heros/shared/useDarkTheme'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  useDarkTheme()

  return (
    <section
      data-theme="dark"
      className="relative h-[400px] -mt-[var(--header-height)] flex items-center justify-center overflow-hidden text-white text-center"
    >
      {media && typeof media === 'object' && (
        <ParallaxMedia
          resource={media}
          imgClassName="object-cover brightness-[0.4] saturate-[0.75]"
          speed={0.3}
          priority
          sizes="100vw"
        />
      )}
      <div className="relative z-10 container">
        {richText && (
          <RichText
            data={richText}
            enableGutter={false}
            className="prose-invert max-w-2xl mx-auto"
          />
        )}
        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex justify-center gap-4 mt-8">
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
