import React from 'react'

import type { PricingCardsBlock as PricingCardsBlockProps } from '@/payload-types'

export const PricingCardsBlock: React.FC<PricingCardsBlockProps> = ({
  note,
  cards,
}) => (
  <section className="py-20">
    <div className="container text-center">
      {note && <p className="text-sm text-foreground-muted mt-4 mb-8">{note}</p>}
      <div className="flex justify-center gap-6 flex-wrap">
        {cards?.map((card, i) => (
          <div
            key={card.id || i}
            className="bg-card py-10 px-12 rounded text-center flex-1 max-w-[220px]"
          >
            <div className="text-[2.5rem] font-extralight text-primary mb-2">{card.price}</div>
            <div className="text-sm text-foreground-muted">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
