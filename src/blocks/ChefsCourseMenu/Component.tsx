import React from 'react'

import type { ChefsCourseMenuBlock as ChefsCourseMenuBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const ChefsCourseMenuBlock: React.FC<ChefsCourseMenuBlockProps> = ({
  sectionLabel,
  image,
  courses,
}) => (
  <section className="py-28">
    <div className="container grid gap-16 md:grid-cols-[1.2fr_1fr]">
      <div>
        {sectionLabel && <div className="section-label">{sectionLabel}</div>}
        <div className="flex flex-col gap-10 mt-8">
          {courses?.map((course, i) => (
            <div key={course.id || i} className="flex gap-6">
              <span className="text-[2rem] font-extralight text-primary leading-none shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-h3">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-foreground-muted mt-1">{course.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {image && typeof image === 'object' && (
        <Media
          resource={image}
          imgClassName="w-full h-[500px] object-cover rounded saturate-[0.85]"
        />
      )}
    </div>
  </section>
)
