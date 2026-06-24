import Link from 'next/link'
import React from 'react'

import type { ContactCardsBlock as ContactCardsBlockProps } from '@/payload-types'

const defaultLabels: Record<string, string> = {
  address: 'Adresa',
  phone: 'Telefón',
  email: 'E-mail',
  custom: '',
}

export const ContactCardsBlock: React.FC<ContactCardsBlockProps> = ({ cards }) => (
  <section className="py-20">
    <div className="container">
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        {cards?.map((card, i) => {
          const key = card.id ?? i
          const body = (
            <>
              <div className="text-label text-foreground-muted mb-2">
                {card.label || defaultLabels[card.kind || 'custom']}
              </div>
              <div className="text-base text-foreground whitespace-pre-line">{card.value}</div>
            </>
          )
          const className = 'block bg-card rounded p-6 hover:bg-background-muted transition-colors'
          return card.href ? (
            <Link key={key} href={card.href} className={className}>
              {body}
            </Link>
          ) : (
            <div key={key} className={className}>
              {body}
            </div>
          )
        })}
      </div>
    </div>
  </section>
)
