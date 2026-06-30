import type { DailyMenu } from '@/payload-types'

import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'

import { MenuDocument, type MenuLocale } from './MenuDocument'

export async function renderMenuPdf(menu: DailyMenu, locale: MenuLocale): Promise<Buffer> {
  // MenuDocument renders a <Document> at its root; cast to satisfy renderToBuffer's
  // DocumentProps element typing.
  const element = createElement(MenuDocument, { menu, locale }) as Parameters<
    typeof renderToBuffer
  >[0]
  return renderToBuffer(element)
}
