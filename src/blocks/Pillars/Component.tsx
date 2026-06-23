import Link from 'next/link'
import React from 'react'

import type { PillarsBlock as PillarsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const PillarsBlock: React.FC<PillarsBlockProps> = ({ sectionLabel, background, pillars }) => {
  const isLight = background === 'light'
  return (
    <section
      {...(isLight ? {} : { 'data-theme': 'dark' })}
      className={cn(
        'py-28',
        isLight
          ? 'bg-background text-foreground'
          : 'bg-background-olive text-dark-foreground',
      )}
    >
      <div className="container">
        {sectionLabel && (
          <div className={cn('section-label mb-10', !isLight && 'section-label-dark')}>
            {sectionLabel}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pillars?.map((pillar, i) => {
            const cardInner = (
              <>
                <div className="aspect-[4/5] w-full overflow-hidden rounded bg-background-subtle">
                  {pillar.image && typeof pillar.image === 'object' && (
                    <Media
                      resource={pillar.image}
                      imgClassName="w-full h-full object-cover saturate-[0.85] group-hover:saturate-100 group-hover:scale-[1.03] transition-[transform,filter] duration-700"
                    />
                  )}
                </div>
                <div className="mt-6 text-[0.625rem] tracking-[0.2em] text-sage-200">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-3 text-[1.125rem] font-medium tracking-[0.02em] uppercase text-dark-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[0.8125rem] uppercase leading-[1.4] text-dark-muted">
                  {pillar.body}
                </p>
                {pillar.ctaLabel && (
                  <div className="mt-5 inline-flex items-center gap-3 text-[0.6875rem] tracking-[0.14em] uppercase text-dark-foreground-soft transition-opacity group-hover:opacity-80">
                    {pillar.ctaLabel}
                    <span aria-hidden className="inline-block w-3.5 h-px bg-current relative after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:border-r after:border-t after:border-current after:rotate-45" />
                  </div>
                )}
              </>
            )
            const cardCls = 'group flex flex-col p-8 rounded bg-transparent'
            return pillar.ctaHref ? (
              <Link key={pillar.id || i} href={pillar.ctaHref} className={cardCls}>
                {cardInner}
              </Link>
            ) : (
              <div key={pillar.id || i} className={cardCls}>
                {cardInner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
