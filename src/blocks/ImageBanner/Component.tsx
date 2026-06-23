import React from 'react'

import type { ImageBannerBlock as ImageBannerBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const heights = { sm: 'h-[350px]', md: 'h-[500px]', lg: 'h-[700px]', xl: 'h-[900px]' }

// flex-col container: justify-* = vertical, items-* = horizontal
const positions = {
  center: 'items-center justify-center text-center',
  centerLeft: 'items-start justify-center text-left',
  topRight: 'items-end justify-start text-right',
}

// Newline = line break; [segment] = italic emphasis.
function renderHeading(text: string): React.ReactNode {
  return text.split('\n').map((line, li) => (
    <React.Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/\[([^\]]+)\]/g).map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="font-light italic">
            {part}
          </em>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </React.Fragment>
  ))
}

export const ImageBannerBlock: React.FC<ImageBannerBlockProps> = ({
  image,
  overlayLabel,
  overlayHeading,
  height,
  overlayPosition,
  showCopyMark,
  links,
}) => {
  const link = links?.[0]?.link
  return (
    <section
      data-theme="dark"
      className={cn(
        'relative overflow-hidden text-dark-foreground',
        heights[height || 'md'],
      )}
    >
      {image && typeof image === 'object' && (
        <Media fill resource={image} imgClassName="object-cover brightness-[0.55] saturate-[0.85]" />
      )}

      {showCopyMark && (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-[8%] right-2 z-[1] select-none font-display font-normal leading-[0.8] text-dark-foreground-soft/90 text-[44vw] lg:text-[30rem]"
        >
          ©
        </span>
      )}

      <div
        className={cn(
          'absolute inset-0 z-[2] flex flex-col gap-3 px-6 py-12 md:px-20 md:py-16',
          positions[overlayPosition || 'center'],
        )}
      >
        {overlayLabel && (
          <p className="text-label text-dark-foreground/55">{overlayLabel}</p>
        )}
        <h2 className="font-display font-normal uppercase leading-[1.15] tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.5rem)] max-w-[20ch]">
          {renderHeading(overlayHeading)}
        </h2>
        {link && (
          <CMSLink
            {...link}
            appearance="inline"
            className="group mt-4 inline-flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.14em] text-dark-foreground-soft transition-opacity hover:opacity-80"
          >
            <span
              aria-hidden
              className="inline-block w-3.5 h-px bg-current relative transition-all group-hover:w-5 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:border-r after:border-t after:border-current after:rotate-45"
            />
          </CMSLink>
        )}
      </div>
    </section>
  )
}
