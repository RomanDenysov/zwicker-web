'use client'

import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

import { useParallax } from './useParallax'

type Props = {
  resource: MediaType
  imgClassName?: string
  speed?: number
}

export const ParallaxMedia: React.FC<Props> = ({ resource, imgClassName, speed }) => {
  const ref = useParallax<HTMLDivElement>(speed)
  return (
    <div ref={ref} className="parallax-wrap absolute inset-0">
      <Media fill priority resource={resource} imgClassName={imgClassName} />
    </div>
  )
}
