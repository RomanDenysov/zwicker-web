'use client'

import { Menu, X } from 'lucide-react'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MobileMenu } from '@/components/MobileMenu'
import { ReserveMenu } from '@/components/ReserveMenu'

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
        {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <MobileMenu open={mobileOpen} navItems={navItems} onClose={() => onMobileOpenChange(false)} />
    </nav>
  )
}
