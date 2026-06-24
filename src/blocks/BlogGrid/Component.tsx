import Link from 'next/link'
import React from 'react'

import type { BlogGridBlock as BlogGridBlockProps, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { formatDateTime } from '@/utilities/formatDateTime'

export const BlogGridBlock: React.FC<BlogGridBlockProps> = async ({
  source,
  limit,
  posts,
}) => {
  let items: Post[] = []

  if (source === 'selected' && Array.isArray(posts)) {
    items = posts.filter((p): p is Post => typeof p === 'object' && p !== null)
  } else {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      limit: limit || 3,
      sort: '-publishedAt',
      depth: 2,
    })
    items = result.docs
  }

  if (!items.length) return null

  return (
    <section className="py-20">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PostCard({ post }: { post: Post }) {
  const { title, slug, heroImage, meta, categories, publishedAt } = post
  const description = meta?.description
  const firstCategory =
    Array.isArray(categories) && typeof categories[0] === 'object' ? categories[0] : null
  return (
    <Link href={`/posts/${slug}`} className="group bg-card rounded overflow-hidden flex flex-col">
      {heroImage && typeof heroImage === 'object' && (
        <Media
          resource={heroImage}
          imgClassName="w-full h-[220px] object-cover saturate-[0.85] group-hover:saturate-100 transition-[filter]"
        />
      )}
      <div className="p-6 flex flex-col gap-3 grow">
        <div className="flex gap-3 items-center text-xs">
          {firstCategory && 'title' in firstCategory && (
            <span className="text-label text-primary">{firstCategory.title}</span>
          )}
          {publishedAt && (
            <time className="text-foreground-muted" dateTime={publishedAt}>
              {formatDateTime(publishedAt)}
            </time>
          )}
        </div>
        <h3 className="text-h3 group-hover:text-primary transition-colors">{title}</h3>
        {description && (
          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">{description}</p>
        )}
      </div>
    </Link>
  )
}
