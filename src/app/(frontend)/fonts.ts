import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

/**
 * Centralised font configuration for the front-end.
 *
 * - `dmSans`  -> body / UI text. `latin-ext` subset is required for Slovak diacritics.
 * - `bagoss`  -> Bagoss Condensed (licensed) display face. Only Regular (400) and
 *   Medium (500) are available; the Figma "Light" display weight falls back to Regular.
 * - `geistMono` -> kept for code / monospace blocks.
 *
 * CSS variables are consumed in `globals.css`:
 *   --font-sans    -> var(--font-dm-sans)
 *   --font-display -> var(--font-bagoss)
 *   --font-mono    -> var(--font-geist-mono)
 */
export const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const bagoss = localFont({
  src: [
    { path: '../../../public/fonts/BagossCondensed-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/BagossCondensed-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-bagoss',
  display: 'swap',
})

export const geistMono = GeistMono

/** All font CSS-variable classes, ready to drop onto `<html>`. */
export const fontVariables = cn(dmSans.variable, bagoss.variable, geistMono.variable)
