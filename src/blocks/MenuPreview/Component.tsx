import React from 'react'

import type { MenuPreviewBlock as MenuPreviewBlockProps, Media as MediaType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getDailyMenu } from '@/DailyMenu/getDailyMenu'

export const MenuPreviewBlock: React.FC<MenuPreviewBlockProps> = async ({
  sectionLabel,
  heading,
  categoriesLimit,
  itemsPerCategory,
  links,
  images,
}) => {
  const menu = await getDailyMenu()
  const categories = (menu.categories || []).slice(0, categoriesLimit || 2)
  const [headingLine1, headingLine2] = (heading || '').split('\n')
  const photos = (images || []).filter((i): i is MediaType => typeof i === 'object')

  const columns: (typeof categories)[] = [[], []]
  categories.forEach((cat, i) => columns[i % 2].push(cat))

  return (
    <section className="py-28 bg-background-warm">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-[36rem]">
            {sectionLabel && <div className="section-label">{sectionLabel}</div>}
            {(headingLine1 || headingLine2) && (
              <h2 className="text-h2">
                {headingLine1}
                {headingLine2 && (
                  <>
                    <br />
                    {headingLine2}
                  </>
                )}
              </h2>
            )}
          </div>
          {links && links.length > 0 && (
            <div className="flex gap-4">
              {links.map((item, i) => (
                <CMSLink key={item.id ?? i} {...item.link} />
              ))}
            </div>
          )}
        </div>
        <div className="grid gap-12 md:grid-cols-[1fr_1px_1fr]">
          <MenuColumn categories={columns[0]} limit={itemsPerCategory || 3} />
          <div className="hidden md:block bg-foreground/10" />
          <MenuColumn categories={columns[1]} limit={itemsPerCategory || 3} />
        </div>
        {photos.length > 0 && (
          <div className="mt-16 flex flex-col gap-4 md:flex-row">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className={i === 0 ? 'md:w-[840px] md:max-w-[60%]' : 'md:flex-1'}
              >
                <Media
                  resource={photo}
                  imgClassName="w-full h-[320px] md:h-[420px] object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function MenuColumn({
  categories,
  limit,
}: {
  categories: NonNullable<Awaited<ReturnType<typeof getDailyMenu>>['categories']>
  limit: number
}) {
  return (
    <div className="flex flex-col gap-8">
      {categories.map((cat, i) => (
        <div key={cat.id || i}>
          <h4 className="text-eyebrow mb-4">{cat.name}</h4>
          <div className="flex flex-col">
            {(cat.items || []).slice(0, limit).map((item, j) => (
              <div
                key={item.id || j}
                className="flex flex-col gap-1 py-3.5 border-b border-foreground/8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[0.9375rem] font-medium uppercase tracking-[0.01em]">
                    {item.name}
                  </span>
                  <span
                    aria-hidden
                    className="flex-1 border-b border-dashed border-foreground-subtle/50 translate-y-[-3px]"
                  />
                  {typeof item.price === 'number' && (
                    <span className="text-price whitespace-nowrap">
                      {item.price.toFixed(2)} €
                    </span>
                  )}
                </div>
                {item.description && (
                  <small className="text-xs font-light text-foreground-muted">
                    {item.description}
                  </small>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
