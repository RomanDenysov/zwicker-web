'use client'

import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { useHeaderTheme } from '@/providers/HeaderTheme'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <section
      data-theme="dark"
      className="relative h-[240px] -mt-[var(--header-height)] bg-dark text-dark-foreground flex items-center"
    >
      <div className="container">
        <div className="max-w-[48rem] pt-[var(--header-height)] pb-6">
          {children || (richText && <RichText data={richText} enableGutter={false} className="prose-invert" />)}
        </div>
      </div>
    </section>
  )
}
