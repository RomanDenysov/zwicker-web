import { cn } from '@/utilities/ui'
import React from 'react'

type Size = 'sm' | 'md' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: 'text-sm tracking-[0.3em]',
  md: 'text-base tracking-[0.35em]',
  lg: 'text-2xl tracking-[0.35em]',
}

type Props = {
  size?: Size
  className?: string
}

export const Logo = ({ size = 'md', className }: Props) => (
  <span
    aria-label="Zwicker"
    className={cn('font-medium leading-none select-none', sizeClass[size], className)}
  >
    ZW<span className="copy-mark">©</span>KR
  </span>
)
