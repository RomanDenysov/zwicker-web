import React from 'react'

import type { StatsRowBlock as StatsRowBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'

export const StatsRowBlock: React.FC<StatsRowBlockProps> = ({
  heading,
  body,
  stats,
}) => (
  <section className="py-20">
    <div className="container max-w-4xl">
      {heading && <h2 className="text-h2 mb-4">{heading}</h2>}
      {body && <p className="text-base text-foreground-muted leading-relaxed mb-10">{body}</p>}
      <Reveal stagger className="flex flex-wrap gap-10">
        {stats?.map((stat, i) => (
          <div key={stat.id || i}>
            <div className="text-[1.8rem] font-normal">{stat.value}</div>
            <div className="text-label text-foreground-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
)
