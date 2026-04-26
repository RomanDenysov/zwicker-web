import React from 'react'

import type { EnSectionBlock as EnSectionBlockProps } from '@/payload-types'

export const EnSectionBlock: React.FC<EnSectionBlockProps> = ({ heading, body }) => (
  <section className="py-16 bg-background-muted">
    <div className="container max-w-5xl">
      {heading && <h3 className="text-h3 mb-4">{heading}</h3>}
      <p className="text-base leading-relaxed text-foreground">{body}</p>
    </div>
  </section>
)
