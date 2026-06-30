import React from 'react'

import type { PricingCardsBlock as PricingCardsBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'

export const PricingCardsBlock: React.FC<PricingCardsBlockProps> = ({
  note,
  cards,
}) => (
  <section className="py-20">
    <div className="container max-w-4xl">
      {note && (
        <p className="text-eyebrow text-center mx-auto max-w-sm leading-relaxed mb-12">
          {note}
        </p>
      )}
      <Reveal stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {cards?.map((card, i) => (
          <div
            key={card.id || i}
            className="group flex flex-col items-center justify-center rounded-[3px] border border-border bg-card px-6 py-12 text-center transition duration-500 ease-out-quint hover:-translate-y-1 hover:border-border-strong hover:bg-popover hover:shadow-[0_18px_40px_-24px_rgba(28,28,26,0.35)]"
          >
            <span className="font-display text-[clamp(2rem,4vw,2.75rem)] font-light leading-[1.05] text-primary text-balance">
              {card.price}
            </span>
            <span className="my-5 h-px w-8 bg-primary/30 transition-all duration-500 ease-out-quint group-hover:w-12" />
            <span className="text-label text-foreground-muted">{card.label}</span>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
)
