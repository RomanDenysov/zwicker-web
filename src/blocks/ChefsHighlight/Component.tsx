import React from 'react'

import type { ChefsHighlightBlock as ChefsHighlightBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

import { renderCopyMark } from '../shared/renderCopyMark'

export const ChefsHighlightBlock: React.FC<ChefsHighlightBlockProps> = ({
  sectionLabel,
  logo,
  heading,
  quote,
  body,
  details,
  image,
  badge,
  links,
}) => (
  <section className="py-28 bg-background-muted">
    <div className="container grid gap-20 items-center md:grid-cols-2">
      <div>
        {sectionLabel && <div className="section-label">{sectionLabel}</div>}
        {logo && (
          <div className="text-[1.8rem] font-light tracking-[0.12em] mb-2">
            {renderCopyMark(logo)}
          </div>
        )}
        <h2 className="text-h2 mb-6">{heading}</h2>
        {quote && (
          <blockquote className="border-l-2 border-primary pl-6 italic text-foreground-muted mb-6 leading-relaxed">
            {quote}
          </blockquote>
        )}
        {body && <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>}
        {details && details.length > 0 && (
          <div className="flex gap-10 mt-8">
            {details.map((d, i) => (
              <div key={d.id || i}>
                <div className="text-xl font-normal">{d.value}</div>
                <div className="text-[0.65rem] tracking-[0.12em] uppercase text-foreground-muted mt-1">
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <ul className="flex gap-5 mt-10">
            {links.map((item, i) => (
              <li key={item.id ?? i}>
                <CMSLink {...item.link} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative">
        {image && typeof image === 'object' && (
          <Media
            resource={image}
            imgClassName="w-full h-[580px] object-cover rounded saturate-[0.85]"
          />
        )}
        {badge && (
          <div className="absolute top-6 right-6 w-[70px] h-[70px] rounded-full bg-primary text-white text-[0.55rem] tracking-[0.12em] uppercase flex items-center justify-center text-center leading-tight px-2">
            {badge}
          </div>
        )}
      </div>
    </div>
  </section>
)
