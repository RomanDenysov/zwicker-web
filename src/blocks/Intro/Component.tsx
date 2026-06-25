import React from 'react'

import type { IntroBlock as IntroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ParallaxMedia } from '@/heros/shared/ParallaxMedia'
import { cn } from '@/utilities/ui'

import { renderCopyMark } from '../shared/renderCopyMark'

export const IntroBlock: React.FC<IntroBlockProps> = ({
  heading,
  body,
  image,
  imagePosition,
  links,
}) => (
  <section className="py-28">
    <div
      className={cn(
        'container grid gap-20 items-center md:grid-cols-2',
        imagePosition === 'left' && 'md:[&>*:first-child]:order-2',
      )}
    >
      <div>
        <h2 className="text-h1 mb-6">{renderCopyMark(heading)}</h2>
        {body && <p className="text-base leading-relaxed text-foreground-muted max-w-md">{body}</p>}
        {links && links.length > 0 && (
          <ul className="flex gap-5 mt-8">
            {links.map(({ link }, i) => (
              <li key={i}>
                <CMSLink {...link} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {image && typeof image === 'object' && (
        <div className="relative h-[550px] w-full overflow-hidden rounded">
          <ParallaxMedia
            resource={image}
            imgClassName="object-cover saturate-[0.85]"
            speed={0.12}
            anchor="center"
            priority={false}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
    </div>
  </section>
)
