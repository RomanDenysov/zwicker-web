import React from 'react'

import { Media } from '@/components/Media'
import { MenuDownloadButton } from '@/DailyMenu/MenuDownloadButton'
import { getDailyMenu } from '@/DailyMenu/getDailyMenu'

export const DailyMenuImageBlock: React.FC = async () => {
  const menu = await getDailyMenu()
  if (!menu.menuImage && !menu.allergenNote && !menu.enableGuestDownload) return null

  return (
    <section className="py-20">
      <div className="container">
        {menu.menuImage && typeof menu.menuImage === 'object' && (
          <div className="max-w-xl mx-auto">
            <Media
              resource={menu.menuImage}
              size="(max-width: 768px) 100vw, 576px"
              imgClassName="w-full h-auto rounded"
            />
          </div>
        )}
        {menu.allergenNote && (
          <p className="text-center text-sm italic text-foreground-muted mt-10 max-w-3xl mx-auto">
            {menu.allergenNote}
          </p>
        )}
        {menu.enableGuestDownload && (
          <div className="mt-10 flex justify-center">
            {/* Frontend is SK-only (`<html lang="sk">`); thread the active locale here once localized routing exists. */}
            <MenuDownloadButton locale="sk" />
          </div>
        )}
      </div>
    </section>
  )
}
