import Link from 'next/link'
import React from 'react'

import type { FeaturedPostBlock as FeaturedPostBlockProps, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

export const FeaturedPostBlock: React.FC<FeaturedPostBlockProps> = ({ sectionLabel, post }) => {
  if (typeof post !== 'object' || post === null) return null
  const { title, slug, heroImage, meta, categories, publishedAt } = post as Post
  const description = meta?.description
  const firstCategory =
    Array.isArray(categories) && typeof categories[0] === 'object' ? categories[0] : null

  return (
    <section className="py-20">
      <div className="container">
        {sectionLabel && <div className="section-label mb-8">{sectionLabel}</div>}
        <Link
          href={`/posts/${slug}`}
          className="grid gap-10 md:grid-cols-2 items-center group"
        >
          {heroImage && typeof heroImage === 'object' && (
            <Media
              resource={heroImage}
              imgClassName="w-full h-[380px] object-cover rounded saturate-[0.85] group-hover:saturate-100 transition-[filter]"
            />
          )}
          <div>
            {firstCategory && 'title' in firstCategory && (
              <div className="text-label text-primary mb-3">{firstCategory.title}</div>
            )}
            {publishedAt && (
              <time className="text-sm text-foreground-muted" dateTime={publishedAt}>
                {formatDateTime(publishedAt)}
              </time>
            )}
            <h2 className="text-h2 mt-3 group-hover:text-primary transition-colors">{title}</h2>
            {description && (
              <p className="text-base text-foreground-muted mt-4 leading-relaxed">{description}</p>
            )}
          </div>
        </Link>
      </div>
    </section>
  )
}
