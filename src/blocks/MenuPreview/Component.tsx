import React from 'react'

import type { MenuPreviewBlock as MenuPreviewBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { getDailyMenu } from '@/DailyMenu/getDailyMenu'

export const MenuPreviewBlock: React.FC<MenuPreviewBlockProps> = async ({
  sectionLabel,
  heading,
  categoriesLimit,
  itemsPerCategory,
  links,
}) => {
  const menu = await getDailyMenu()
  const categories = (menu.categories || []).slice(0, categoriesLimit || 2)
  const [headingLine1, headingLine2] = (heading || '').split('\n')

  const columns: (typeof categories)[] = [[], []]
  categories.forEach((cat, i) => columns[i % 2].push(cat))

  return (
    <section className="py-28">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            {sectionLabel && <div className="section-label">{sectionLabel}</div>}
            {(headingLine1 || headingLine2) && (
              <h2 className="text-h1">
                {headingLine1}
                {headingLine2 && (
                  <>
                    <br />
                    <span className="italic text-primary">{headingLine2}</span>
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
        <div className="grid gap-10 md:grid-cols-[1fr_1px_1fr]">
          <MenuColumn categories={columns[0]} limit={itemsPerCategory || 3} />
          <div className="hidden md:block bg-border" />
          <MenuColumn categories={columns[1]} limit={itemsPerCategory || 3} />
        </div>
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
    <div className="flex flex-col gap-10">
      {categories.map((cat, i) => (
        <div key={cat.id || i}>
          <h4 className="text-label text-primary border-b border-primary/15 pb-2 mb-5">
            {cat.name}
          </h4>
          <div className="flex flex-col">
            {(cat.items || []).slice(0, limit).map((item, j) => (
              <div
                key={item.id || j}
                className="flex justify-between items-baseline py-3 border-b border-border"
              >
                <div className="font-medium">
                  {item.name}
                  {item.description && (
                    <small className="block mt-1 text-xs font-light italic text-foreground-muted">
                      {item.description}
                    </small>
                  )}
                </div>
                {typeof item.price === 'number' && (
                  <span className="font-medium text-primary ml-6 whitespace-nowrap">
                    {item.price.toFixed(2)} €
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
