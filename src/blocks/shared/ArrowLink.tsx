import React from 'react'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type ArrowLinkProps = React.ComponentProps<typeof CMSLink>

/**
 * CTA rendered as an uppercase label trailed by an animated arrow.
 * Shared treatment for the dark section blocks (Chef's Table, rooms…).
 * Pass a `text-*` colour via `className`; the arrow inherits `currentColor`.
 */
export const ArrowLink: React.FC<ArrowLinkProps> = ({ className, ...link }) => (
  <CMSLink
    {...link}
    appearance="inline"
    className={cn(
      'group inline-flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.14em] transition-opacity duration-200 ease-out-quint hover:opacity-70',
      className,
    )}
  >
    <span
      aria-hidden
      className="inline-block w-3.5 h-px bg-current relative transition-[width] duration-300 ease-smooth group-hover:w-5 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:border-r after:border-t after:border-current after:rotate-45"
    />
  </CMSLink>
)
