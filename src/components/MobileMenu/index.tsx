'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { reservationItems } from '@/components/ReserveMenu/items'
import { cn } from '@/utilities/ui'

type Props = {
  open: boolean
  navItems: NonNullable<HeaderType['navItems']>
  onClose: () => void
}

const reserveItemClass =
  'flex items-center gap-3 rounded-md border border-dark-border px-4 py-3.5 transition-colors'

/**
 * Full-screen mobile navigation. The header melts into this ink surface (see
 * Header/Component.client.tsx, which forces the bar dark while `open`), so the bar
 * and this panel read as one continuous surface. The global grain overlay sits on
 * top of both. Mobile only — desktop nav lives in Header/Nav.
 */
export const MobileMenu: React.FC<Props> = ({ open, navItems, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    // Land keyboard/SR focus inside the dialog when it opens.
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Hlavné menu"
      data-theme="dark"
      tabIndex={-1}
      className="md:hidden fixed inset-x-0 top-[var(--header-height)] bottom-0 z-40 flex flex-col overflow-y-auto bg-dark text-dark-foreground focus:outline-none"
    >
      <div className="container flex flex-1 flex-col py-8">
        <nav aria-label="Hlavná navigácia">
          <ul className="flex flex-col">
            {navItems.map(({ link }, i) => (
              <li
                key={i}
                onClick={onClose}
                className="animate-fade-up border-b border-dark-border"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CMSLink
                  {...link}
                  appearance="inline"
                  className="block py-4 font-display text-[1.9rem] leading-tight tracking-[-0.01em] text-dark-foreground-soft transition-colors hover:text-primary-light"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-10">
          <p className="text-label mb-4 text-dark-subtle">Rezervácia</p>
          <div className="flex flex-col gap-3">
            {reservationItems.map((item) => {
              const Icon = item.icon

              if (item.href) {
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    className={cn(reserveItemClass, 'bg-white/5 hover:bg-white/10')}
                  >
                    <Icon className="size-5 text-foreground-sage" />
                    <span className="font-display text-sm uppercase tracking-[0.02em] text-dark-foreground">
                      {item.label}
                    </span>
                  </Link>
                )
              }

              // Not wired yet (e.g. Bookio) — disabled "čoskoro" mock.
              return (
                <div
                  key={item.key}
                  aria-disabled="true"
                  className={cn(reserveItemClass, 'text-dark-muted')}
                >
                  <Icon className="size-5 text-dark-muted" />
                  <span className="flex-1 font-display text-sm uppercase tracking-[0.02em]">
                    {item.label}
                  </span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-dark-strong">
                    čoskoro
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex justify-center text-dark-subtle">
            <Logo variant="mark" size="md" />
          </div>
        </div>
      </div>
    </div>
  )
}
