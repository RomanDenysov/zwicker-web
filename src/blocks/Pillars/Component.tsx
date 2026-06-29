import Link from 'next/link'
import React from 'react'

import type { PillarsBlock as PillarsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/utilities/ui'

export const PillarsBlock: React.FC<PillarsBlockProps> = ({ background, pillars }) => {
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
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pillars?.map((pillar, i) => {
            const cardInner = (
              <>
                <div className="aspect-[4/5] w-full overflow-hidden rounded bg-background-subtle">
                  {pillar.image && typeof pillar.image === 'object' && (
                    <Media
                      resource={pillar.image}
                      size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      imgClassName="w-full h-full object-cover transform-gpu saturate-[0.85] group-hover:saturate-100 group-hover:scale-[1.03] transition-[transform,scale,filter] duration-500 ease-smooth"
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
                  <div className="mt-5 inline-flex items-center gap-3 text-[0.6875rem] tracking-[0.14em] uppercase text-dark-foreground-soft opacity-80 transition-opacity duration-200 ease-out-quint group-hover:opacity-100">
                    {pillar.ctaLabel}
                    <span aria-hidden className="inline-block w-3.5 h-px bg-current relative transition-[width] duration-300 ease-smooth group-hover:w-5 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:border-r after:border-t after:border-current after:rotate-45" />
                  </div>
                )}
              </>
            )
            const cardCls = 'group flex flex-col p-8 rounded bg-transparent'
            return pillar.ctaHref ? (
              <Link
                key={pillar.id || i}
                href={pillar.ctaHref}
                className={cn(cardCls, 'transition-transform duration-300 ease-out-quint active:scale-[0.99]')}
              >
                {cardInner}
              </Link>
            ) : (
              <div key={pillar.id || i} className={cardCls}>
                {cardInner}
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
