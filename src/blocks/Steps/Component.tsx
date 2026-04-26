import React from 'react'

import type { StepsBlock as StepsBlockProps } from '@/payload-types'

export const StepsBlock: React.FC<StepsBlockProps> = ({ sectionLabel, heading, steps }) => (
  <section className="py-28">
    <div className="container">
      <div className="text-center mb-14">
        {sectionLabel && (
          <div className="section-label section-label-center">{sectionLabel}</div>
        )}
        {heading && <h2 className="text-h1 mt-4">{heading}</h2>}
      </div>
      <div className="grid gap-10 md:grid-cols-3">
        {steps?.map((step, i) => (
          <div key={step.id || i}>
            <div className="text-[2.5rem] font-extralight text-primary leading-none mb-4">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="text-h3 mb-3">{step.title}</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
