import { cn } from '@/utilities/ui'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

// Responsive side gutter shared by every section shell. Grows with the viewport.
// Kept in sync with the `.container` fallback in globals.css.
const gutter = 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20'

/**
 * Section shell widths. `full` is the site default: full-viewport width with a
 * responsive gutter and no max-width cap.
 */
export const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      full: gutter,
      wide: `max-w-[120rem] ${gutter}`, // soft cap (~1920px) for ultra-wide screens
      bleed: '', // edge-to-edge, no gutter (full-bleed media / galleries)
    },
  },
  defaultVariants: {
    size: 'full',
  },
})

export interface ContainerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof containerVariants> {}

export const Container: React.FC<ContainerProps> = ({ className, size, ...props }) => (
  <div className={cn(containerVariants({ size }), className)} {...props} />
)

/**
 * Named content-column widths. Readability caps for headings, intros and body
 * copy that live *inside* a Container. Centralized so the magic numbers live in
 * one place instead of being repeated per block.
 */
export const contentWidth = {
  prose: 'max-w-[48rem]', // long intros / rich text
  text: 'max-w-[40rem]', // section heading + lede
  intro: 'max-w-[36rem]', // section heading block
  narrow: 'max-w-[30rem]', // tight heading block
  tight: 'max-w-[28rem]', // small supporting copy
} as const
