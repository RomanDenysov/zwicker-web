'use client'

import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { useDarkTheme } from '@/heros/shared/useDarkTheme'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post
  useDarkTheme()

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <section
      data-theme="dark"
      className="relative h-[400px] -mt-[var(--header-height)] flex items-end overflow-hidden text-white"
    >
      {heroImage && typeof heroImage === 'object' && (
        <ParallaxMedia
          resource={heroImage}
          imgClassName="object-cover brightness-[0.4] saturate-[0.75]"
          speed={0.3}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <div className="relative z-10 container pb-10">
        {categories && categories.length > 0 && (
          <div className="text-label text-white/70 mb-4">
            {categories.map((category, i) => {
              if (typeof category === 'object' && category !== null) {
                const titleToUse = category.title || 'Untitled'
                const isLast = i === categories.length - 1
                return (
                  <React.Fragment key={i}>
                    {titleToUse}
                    {!isLast && ', '}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>
        )}
        <h1 className="text-h1 max-w-3xl">{title}</h1>
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 mt-6 text-sm text-white/70">
          {hasAuthors && (
            <div>
              <div className="text-label text-white/40 mb-1">Autor</div>
              <p>{formatAuthors(populatedAuthors)}</p>
            </div>
          )}
          {publishedAt && (
            <div>
              <div className="text-label text-white/40 mb-1">Dátum</div>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
