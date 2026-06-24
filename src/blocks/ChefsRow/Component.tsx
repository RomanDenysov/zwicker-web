import React from 'react'

import type { ChefsRowBlock as ChefsRowBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const ChefsRowBlock: React.FC<ChefsRowBlockProps> = ({ chefs }) => (
  <section className="py-28 bg-background-muted">
    <div className="container">
      <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
        {chefs?.map((chef, i) => (
          <div key={chef.id || i} className="text-center">
            {chef.photo && typeof chef.photo === 'object' && (
              <Media
                resource={chef.photo}
                imgClassName="w-[280px] h-[350px] object-cover rounded saturate-[0.85] mx-auto"
              />
            )}
            <h3 className="text-h3 mt-6">{chef.name}</h3>
            <p className="text-label text-foreground-muted mt-1">{chef.role}</p>
            {chef.bio && (
              <p className="text-sm text-foreground-muted mt-4 leading-relaxed">{chef.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
)
