import React from 'react'

import type { ImageBannerBlock as ImageBannerBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const heights = { sm: 'h-[350px]', md: 'h-[500px]', lg: 'h-[700px]' }

function renderEmphasis(text: string): React.ReactNode {
  // Wraps [segment] as italic emphasis
  const parts = text.split(/\[([^\]]+)\]/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="font-light italic">
        {part}
      </em>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  )
}

export const ImageBannerBlock: React.FC<ImageBannerBlockProps> = ({
  image,
  overlayLabel,
  overlayHeading,
  height,
}) => (
  <section
    data-theme="dark"
    className={cn('relative overflow-hidden text-white', heights[height || 'md'])}
  >
    {image && typeof image === 'object' && (
      <Media fill resource={image} imgClassName="object-cover brightness-[0.55] saturate-[0.8]" />
    )}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      {overlayLabel && (
        <p className="text-label text-white/45 mb-4">{overlayLabel}</p>
      )}
      <h2 className="text-h1 max-w-3xl">{renderEmphasis(overlayHeading)}</h2>
    </div>
  </section>
)
