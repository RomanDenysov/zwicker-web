'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Container } from '@/components/Container'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the menu when the route changes (covers back/forward navigation; link
  // clicks already close it in MobileMenu). Adjusted during render per
  // https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

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

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  // `headerTheme` resolves from the hero's client effect (after paint); until then fall back
  // to the route so dark-hero pages stay transparent from the first paint (no bg flash).
  const isDark = headerTheme === 'dark' || (headerTheme == null && isDarkHeroRoute(pathname))
  const transparent = !mobileOpen && isDark && !scrolled

  return (
    <header
      data-theme="dark"
      className="sticky top-0 z-50 h-(--header-height) text-white"
    >
      {/* Background. Mobile menu is a flat panel; otherwise a factory.ai-style progressive
          blur: frosted+tinted at the top edge, fading to clear past the bar. Fades in on
          scroll (opacity) so the hero top stays fully transparent. */}
      {mobileOpen ? (
        <div aria-hidden className="absolute inset-0 bg-dark" />
      ) : (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-[160%] transition-opacity duration-300',
            transparent ? 'opacity-0' : 'opacity-100',
          )}
        >
          <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,black_0%,black_18%,transparent_40%)]" />
          <div className="absolute inset-0 backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,transparent_10%,black_30%,black_42%,transparent_62%)]" />
          <div className="absolute inset-0 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,transparent_34%,black_54%,black_64%,transparent_84%)]" />
          <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent_56%,black_74%,transparent_100%)]" />
          {/* Dark tint overlay for legibility, fading out with the blur. */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/85 via-dark/40 to-transparent" />
        </div>
      )}

      <Container className="relative h-full flex items-center justify-between">
        <Link href="/" aria-label="Zwicker - domov">
          <Logo variant="mark" />
        </Link>
        <HeaderNav data={data} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      </Container>
    </header>
  )
}
