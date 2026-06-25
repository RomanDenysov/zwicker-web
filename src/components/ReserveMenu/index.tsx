'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { reservationItems } from './items'

const itemClass =
  'flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-left transition-colors'

export const ReserveMenu: React.FC = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Rezervovať
        <ChevronDown className={cn('transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {reservationItems.map((item) => {
            const Icon = item.icon

            if (item.href) {
              return (
                <Link
                  key={item.key}
                  role="menuitem"
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(itemClass, 'hover:bg-background-muted')}
                >
                  <Icon className="size-4 text-foreground-muted" />
                  {item.label}
                </Link>
              )
            }

            // Not wired yet (e.g. Bookio) — render a disabled "čoskoro" mock.
            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled
                className={cn(itemClass, 'opacity-60')}
              >
                <Icon className="size-4 text-foreground-muted" />
                <span className="flex-1">{item.label}</span>
                <span className="rounded bg-background-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                  čoskoro
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
