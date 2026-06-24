'use client'

import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

import { useParallax } from './useParallax'

type Props = {
  resource: MediaType
  imgClassName?: string
  speed?: number
  priority?: boolean
  anchor?: 'top' | 'center'
}

export const ParallaxMedia: React.FC<Props> = ({
  resource,
  imgClassName,
  speed,
  priority = true,
  anchor = 'top',
}) => {
  const ref = useParallax<HTMLDivElement>(speed, anchor)
  return (
    <div ref={ref} className="parallax-wrap absolute inset-0">
      <Media fill priority={priority} resource={resource} imgClassName={imgClassName} />
    </div>
  )
}
