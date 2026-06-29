'use client'

import { Menu, X } from 'lucide-react'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MobileMenu } from '@/components/MobileMenu'
import { ReserveMenu } from '@/components/ReserveMenu'
import { cn } from '@/utilities/ui'

// Both icons stay mounted, stacked in the same grid cell; the open state crossfades
// between them (blur + scale pop) instead of a hard swap. See Transitions.dev icon-swap.
const iconSwapBase =
  'col-start-1 row-start-1 size-6 transition-all duration-[250ms] ease-in-out motion-reduce:transition-none'

type Props = {
  data: HeaderType
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export const HeaderNav: React.FC<Props> = ({ data, mobileOpen, onMobileOpenChange }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-7 md:gap-9">
      <ul className="hidden md:flex items-center gap-7">
        {navItems.map(({ link }, i) => (
          <li key={i}>
            <CMSLink
              {...link}
              appearance="inline"
              className="text-nav opacity-80 hover:opacity-100 transition-opacity"
            />
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <ReserveMenu />
      </div>

      <button
        type="button"
        className="md:hidden -mr-2 inline-flex size-10 items-center justify-center text-current transition-opacity hover:opacity-70"
        aria-label={mobileOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        onClick={() => onMobileOpenChange(!mobileOpen)}
      >
        <span className="grid place-items-center" aria-hidden="true">
          <Menu
            className={cn(
              iconSwapBase,
              mobileOpen ? 'scale-[0.25] opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-none',
            )}
          />
          <X
            className={cn(
              iconSwapBase,
              mobileOpen ? 'scale-100 opacity-100 blur-none' : 'scale-[0.25] opacity-0 blur-[2px]',
            )}
          />
        </span>
      </button>

      <MobileMenu open={mobileOpen} navItems={navItems} onClose={() => onMobileOpenChange(false)} />
    </nav>
  )
}
