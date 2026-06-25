import Link from 'next/link'
import React from 'react'

import { getSettings } from '@/Settings/getSettings'

export async function HoursStrip() {
  const settings = await getSettings()
  const hours = settings.openingHours || []

  if (!hours.length && !settings.phone) return null

  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/\s/g, '')}` : null

  return (
    <div className="bg-background-olive text-dark-foreground">
      <div className="container py-6 sm:py-8 sm:px-12 px-6 flex flex-col sm:flex-row items-center justify-between gap-x-12 sm:gap-y-4 gap-y-6">
        <div className="md:block hidden text-label text-dark-strong">Otváracie hodiny</div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-3">
          {hours.map((row, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-[0.5625rem] tracking-[0.12em] uppercase text-dark-sub">
                {row.days}
              </span>
              <span className="text-[0.9375rem] text-dark-foreground">{row.hours}</span>
            </div>
          ))}
        </div>
        {settings.phone && (
          <Link
            href={phoneHref!}
            className="flex flex-col items-end text-right hover:opacity-90 transition-opacity"
          >
            <span className="text-[0.9375rem] tracking-[0.03em] text-dark-foreground">
              {settings.phone}
            </span>
            <span className="text-[0.5625rem] tracking-[0.12em] uppercase text-dark-sub">
              Reštaurácia / Recepcia
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
