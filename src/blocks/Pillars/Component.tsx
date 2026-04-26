import React from 'react'

import type { PillarsBlock as PillarsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

export const PillarsBlock: React.FC<PillarsBlockProps> = ({ sectionLabel, background, pillars }) => {
  const isDark = background === 'dark'
  return (
    <section
      {...(isDark ? { 'data-theme': 'dark' } : {})}
      className={cn('py-28', isDark ? 'bg-dark text-dark-foreground' : 'bg-background')}
    >
      <div className="container">
        {sectionLabel && (
          <div className={cn('section-label', isDark && 'section-label-dark')}>{sectionLabel}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-10">
          {pillars?.map((pillar, i) => (
            <div
              key={pillar.id || i}
              className={cn(
                'px-8 py-10 transition-colors',
                i > 0 && 'lg:border-l',
                isDark ? 'lg:border-dark-border hover:bg-white/5' : 'lg:border-border hover:bg-card',
              )}
            >
              <div
                className={cn(
                  'text-label mb-6',
                  isDark ? 'text-primary-light' : 'text-primary',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-h3 mb-3">{pillar.title}</h3>
              <p className={cn('text-sm leading-relaxed', isDark ? 'text-dark-muted' : 'text-foreground-muted')}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
