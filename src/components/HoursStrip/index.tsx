import Link from 'next/link'
import React from 'react'

import { getSettings } from '@/Settings/getSettings'

export async function HoursStrip() {
  const settings = await getSettings()
  const hours = settings.openingHours || []

  if (!hours.length && !settings.phone) return null

  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/\s/g, '')}` : null

  return (
    <div className="bg-primary text-white">
      <div className="container py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-label opacity-70">Otváracie hodiny</div>
        <div className="flex flex-wrap gap-8">
          {hours.map((row, i) => (
            <div key={i} className="flex flex-col text-center md:text-left">
              <span className="text-[0.6rem] tracking-[0.12em] uppercase opacity-55">{row.days}</span>
              <span className="text-base">{row.hours}</span>
            </div>
          ))}
        </div>
        {settings.phone && (
          <Link
            href={phoneHref!}
            className="flex flex-col md:items-end text-center md:text-right hover:opacity-90 transition-opacity"
          >
            <span className="text-base tracking-wide">{settings.phone}</span>
            <span className="text-[0.6rem] tracking-[0.12em] uppercase opacity-55">
              Reštaurácia / Recepcia
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
