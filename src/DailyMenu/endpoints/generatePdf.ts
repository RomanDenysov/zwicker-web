import type { Endpoint } from 'payload'

/**
 * Owner-triggered: generate the menu PDF and store it in Vercel Blob via the
 * `media` collection, then point `daily-menu.menuPdf` at the new file.
 *
 * Mounted at `POST /api/globals/daily-menu/generate-pdf`. The write-back uses
 * `disableRevalidate` to avoid re-triggering the global's afterChange hook.
 */
export const generateMenuPdf: Endpoint = {
  path: '/generate-pdf',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = req
    const locale =
      new URL(req.url ?? '', 'http://localhost').searchParams.get('locale') === 'en' ? 'en' : 'sk'

    const menu = await payload.findGlobal({ slug: 'daily-menu', locale, depth: 0 })

    // Imported lazily so @react-pdf/renderer stays out of the Payload config graph.
    const { renderMenuPdf } = await import('../pdf/renderMenuPdf')
    const buffer = await renderMenuPdf(menu, locale)

    const media = await payload.create({
      collection: 'media',
      data: { alt: `Jedálny lístok (${locale.toUpperCase()})` },
      file: {
        data: buffer,
        name: `jedalny-listok-${locale}-${Date.now()}.pdf`,
        mimetype: 'application/pdf',
        size: buffer.length,
      },
    })

    await payload.updateGlobal({
      slug: 'daily-menu',
      data: { menuPdf: media.id },
      context: { disableRevalidate: true },
    })

    return Response.json({ success: true, id: media.id, url: media.url })
  },
}
