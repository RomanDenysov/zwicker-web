import React from 'react'

import type { FamilyLunchCTABlock as FamilyLunchCTABlockProps } from '@/payload-types'

export const FamilyLunchCTABlock: React.FC<FamilyLunchCTABlockProps> = ({
  sectionLabel,
  heading,
  body,
  courses,
  note,
  priceAdult,
  priceAdultLabel,
  priceChild,
}) => (
  <section data-theme="dark" className="py-28 bg-dark text-white text-center">
    <div className="container max-w-2xl">
      {sectionLabel && (
        <div className="section-label section-label-dark section-label-center">
          {sectionLabel}
        </div>
      )}
      <h2 className="text-h1 mt-5">{heading}</h2>
      {body && <p className="text-base text-white/40 leading-relaxed mt-6">{body}</p>}
      {courses && courses.length > 0 && (
        <div className="text-label flex flex-wrap justify-center gap-2 mt-8 text-white/30">
          {courses.map((c, i) => (
            <React.Fragment key={c.id || i}>
              <span className="text-primary-light">{c.label}</span>
              {i < courses.length - 1 && <span>-</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      {note && <p className="text-[0.7rem] text-white/25 mt-6">{note}</p>}
      {priceAdult && (
        <div className="text-[1.6rem] font-light mt-6">
          {priceAdult}
          {priceAdultLabel && (
            <span className="text-sm text-white/35 ml-2">{priceAdultLabel}</span>
          )}
          {priceChild && (
            <small className="block text-xs text-white/35 mt-1 font-normal">{priceChild}</small>
          )}
        </div>
      )}
    </div>
  </section>
)
