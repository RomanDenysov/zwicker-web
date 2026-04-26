import React from 'react'

import { Media } from '@/components/Media'
import { getDailyMenu } from '@/DailyMenu/getDailyMenu'

export const DailyMenuImageBlock: React.FC = async () => {
  const menu = await getDailyMenu()
  if (!menu.menuImage && !menu.allergenNote) return null

  return (
    <section className="py-20">
      <div className="container">
        {menu.menuImage && typeof menu.menuImage === 'object' && (
          <div className="max-w-xl mx-auto">
            <Media
              resource={menu.menuImage}
              imgClassName="w-full h-auto rounded"
            />
          </div>
        )}
        {menu.allergenNote && (
          <p className="text-center text-sm italic text-foreground-muted mt-10 max-w-3xl mx-auto">
            {menu.allergenNote}
          </p>
        )}
      </div>
    </section>
  )
}
