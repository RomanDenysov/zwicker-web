import Link from 'next/link'
import React from 'react'

import type { FeaturedPostBlock as FeaturedPostBlockProps, Post } from '@/payload-types'

import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { formatDateTime } from '@/utilities/formatDateTime'

export const FeaturedPostBlock: React.FC<FeaturedPostBlockProps> = ({ post }) => {
  if (typeof post !== 'object' || post === null) return null
  const { title, slug, heroImage, meta, categories, publishedAt } = post as Post
  const description = meta?.description
  const firstCategory =
    Array.isArray(categories) && typeof categories[0] === 'object' ? categories[0] : null

  return (
    <section className="py-20">
      <div className="container">
        <Link
          href={`/posts/${slug}`}
          className="grid gap-10 md:grid-cols-2 items-center group"
        >
          {heroImage && typeof heroImage === 'object' && (
            <div className="relative h-[380px] w-full overflow-hidden rounded">
              <ParallaxMedia
                resource={heroImage}
                imgClassName="object-cover saturate-[0.85] group-hover:saturate-100 transition-[filter] duration-500 ease-smooth"
                speed={0.1}
                anchor="center"
                priority={false}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
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
