import React from 'react'

import type { ChefsHighlightBlock as ChefsHighlightBlockProps } from '@/payload-types'

import { Container, contentWidth } from '@/components/Container'
import { CMSLink } from '@/components/Link'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'

import { renderCopyMark } from '../shared/renderCopyMark'

export const ChefsHighlightBlock: React.FC<ChefsHighlightBlockProps> = ({
  logo,
  heading,
  quote,
  body,
  details,
  image,
  links,
}) => (
  <section
    data-theme="dark"
    className="relative overflow-hidden py-28 text-dark-foreground bg-dark"
  >
    {image && typeof image === 'object' && (
      <div className="absolute inset-0">
        <ParallaxMedia
          resource={image}
          imgClassName="object-cover saturate-[0.6] brightness-[0.55]"
          speed={0.15}
          anchor="center"
          priority={false}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(193deg, rgba(28,28,26,0.45) 12%, rgba(28,28,26,0.15) 44%, rgba(28,28,26,0.35) 68%, rgba(28,28,26,0.55) 92%)',
          }}
        />
      </div>
    )}
    <Container className="relative">
      <div className={contentWidth.text}>
        <h2 className="text-display font-extralight tracking-[0.02em] uppercase leading-[0.95] text-foreground-sage">
          {logo ? renderCopyMark(logo) : heading}
        </h2>
        {quote && (
          <p className="mt-10 max-w-[28rem] text-[1.5rem] md:text-[2rem] leading-[1.25] uppercase tracking-[-0.01em] text-dark-foreground-soft">
            {quote}
          </p>
        )}
        {body && (
          <p className="mt-6 max-w-[28rem] text-sm text-dark-muted leading-relaxed">
            {body}
          </p>
        )}
        {details && details.length > 0 && (
          <div className="flex gap-10 mt-10">
            {details.map((d, i) => (
              <div key={d.id || i}>
                <div className="text-[1.375rem] font-normal text-dark-foreground">{d.value}</div>
                <div className="text-[0.65rem] tracking-[0.12em] uppercase text-dark-muted mt-1">
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
    </Container>
  </section>
)
