'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
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
    </nav>
  )
}
