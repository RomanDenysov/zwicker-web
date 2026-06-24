'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

// Routes whose hero is a full-bleed dark image the sticky header overlays at the top.
// Seeding transparency from the path lets the header render transparent on first paint
// (SSR) instead of flashing its solid background before the hero's client effect resolves.
const isDarkHeroRoute = (pathname: string) => pathname === '/'

export const HeaderClient: React.FC<{ data: Header }> = ({ data }) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // `headerTheme` resolves from the hero's client effect (after paint); until then fall back
  // to the route so dark-hero pages stay transparent from the first paint (no bg flash).
  const isDark = headerTheme === 'dark' || (headerTheme == null && isDarkHeroRoute(pathname))
  const transparent = isDark && !scrolled

  return (
    <header
      {...(transparent ? { 'data-theme': 'dark' } : {})}
      className={cn(
        'sticky top-0 z-50 h-16 transition-[background,border,color] duration-300',
        transparent
          ? 'bg-transparent border-b border-transparent text-white'
          : 'bg-background/90 backdrop-blur border-b border-border text-foreground',
      )}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" aria-label="Zwicker - domov">
          <Logo variant="mark" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
