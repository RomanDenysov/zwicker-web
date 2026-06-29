'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { reservationItems } from './items'

const PANEL_W = 240 // matches the menu's w-60
const EASE_OPEN = 'cubic-bezier(0.34,1.25,0.64,1)' // bouncy spring on open

// SSR-safe layout effect: measure before paint on the client, no-op on the server.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const itemClass =
  'flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-left transition-colors'

/**
 * "Rezervovať" CTA. The button stays put as the handle; the panel morphs out of it,
 * unfolding downward — width (button → panel) and height (0 → content) animate with a
 * bouncy spring on open and the faster --ease-out-quint on close, while the items
 * fade/slide/blur in. Adapted from the Transitions.dev plus→menu morph. Desktop header only.
 */
export const ReserveMenu: React.FC = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Panel starts at the button's width and grows to its natural content height. The menu is
  // absolutely positioned, so its height is measurable even while the panel is collapsed.
  const [closedW, setClosedW] = useState(150)
  const [openH, setOpenH] = useState(112)

  useIsoLayoutEffect(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return
    const measure = () => {
      setClosedW(trigger.offsetWidth)
      setOpenH(menu.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trigger)
    ro.observe(menu)
    return () => ro.disconnect()
  }, [])

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
    <div ref={ref} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="reserve-menu"
        onClick={() => setOpen((v) => !v)}
        className={buttonVariants({ size: 'sm' })}
      >
        Rezervovať
        <ChevronDown className={cn('transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'absolute right-0 top-full z-50 mt-2 origin-top-right overflow-hidden rounded-md bg-popover text-popover-foreground transition-[width,height,opacity,box-shadow] will-change-[width,height] motion-reduce:transition-none',
          open
            ? 'opacity-100 shadow-lg ring-1 ring-border duration-[350ms]'
            : 'pointer-events-none opacity-0 shadow-none ring-0 ring-transparent duration-200 ease-[var(--ease-out-quint)]',
        )}
        style={{
          width: open ? PANEL_W : closedW,
          height: open ? openH : 0,
          ...(open ? { transitionTimingFunction: EASE_OPEN } : null),
        }}
      >
        <div
          ref={menuRef}
          id="reserve-menu"
          role="menu"
          aria-hidden={!open}
          inert={!open}
          className={cn(
            'absolute right-0 top-0 w-60 p-1 transition-[opacity,transform,filter] duration-200 ease-[var(--ease-out-quint)] motion-reduce:transition-none',
            open
              ? 'translate-y-0 opacity-100 blur-0'
              : 'pointer-events-none -translate-y-1 opacity-0 blur-[2px]',
          )}
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
      </div>
    </div>
  )
}
