import React from 'react'

import type { PrevioBookingBlock as PrevioBookingBlockProps } from '@/payload-types'

const BOOKING_BASE = 'https://booking.previo.app/index/step-1/'

function buildBookingSrc(hotId: string, language: string, currency: string): string {
  const params = new URLSearchParams({
    hotId,
    currency: currency || 'EUR',
    lang: language || 'sk',
    redirectType: 'iframe',
  })
  // Note: no PHPSESSID — Previo mints a fresh session on load.
  return `${BOOKING_BASE}?${params.toString()}`
}

export const PrevioBookingBlock: React.FC<PrevioBookingBlockProps> = ({
  heading,
  hotId,
  language,
  currency,
  height,
}) => {
  const src = buildBookingSrc(hotId, language || 'sk', currency || 'EUR')

  return (
    <section className="py-20">
      <div className="container">
        {heading && <h2 className="text-h2 mb-8">{heading}</h2>}
        <iframe
          title={heading || 'Rezervácia'}
          src={src}
          className="w-full border-0 rounded overflow-hidden bg-background-muted"
          style={{ minHeight: height ?? 800 }}
          allow="payment"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
