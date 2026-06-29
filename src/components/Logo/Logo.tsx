import { cn } from '@/utilities/ui'
import React from 'react'

import { BrandMark } from './BrandMark'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'wordmark' | 'mark'

const sizeClass: Record<Size, string> = {
  sm: 'text-sm tracking-[0.3em]',
  md: 'text-base tracking-[0.35em]',
  lg: 'text-2xl tracking-[0.35em]',
}

const markSize: Record<Size, number> = {
  sm: 24,
  md: 34,
  lg: 48,
}

type Props = {
  size?: Size
  /** `wordmark` renders the ZW©KR lettering, `mark` renders the circular ©-monogram. */
  variant?: Variant
  className?: string
}

export const Logo = ({ size = 'md', variant = 'wordmark', className }: Props) => {
  if (variant === 'mark') {
    return <BrandMark size={markSize[size]} title="Zwicker" className={className} />
  }

  return (
    <span
      aria-label="Zwicker"
      className={cn('font-display font-regular leading-none select-none', sizeClass[size], className)}
    >
      ZW<span className="copy-mark">©</span>KR
    </span>
  )
}
