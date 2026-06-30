import config from '@payload-config'
import { getPayload } from 'payload'

import { renderMenuPdf } from '@/DailyMenu/pdf/renderMenuPdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const locale = new URL(req.url).searchParams.get('locale') === 'en' ? 'en' : 'sk'

  const payload = await getPayload({ config })
  const menu = await payload.findGlobal({ slug: 'daily-menu', locale, depth: 0 })

  // Guest download is opt-in per the admin toggle (default off).
  if (!menu?.enableGuestDownload) {
    return new Response('Not found', { status: 404 })
  }

  const buffer = await renderMenuPdf(menu, locale)

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="jedalny-listok-${locale}.pdf"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
