// @vitest-environment node
import type { DailyMenu } from '@/payload-types'

import { GET as menuPdfRoute } from '@/app/(frontend)/menu/pdf/route'
import { renderMenuPdf } from '@/DailyMenu/pdf/renderMenuPdf'
import config from '@/payload.config'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const sampleMenu: DailyMenu = {
  id: 1,
  categories: [
    {
      id: 'c1',
      name: 'Polievky',
      items: [
        { id: 'i1', name: 'Kurací vývar', description: '3,5 dl', price: 4.9 },
        { id: 'i2', name: 'Špargľový krém', price: 4.5 },
      ],
    },
    {
      id: 'c2',
      name: 'Hlavné jedlá',
      items: [{ id: 'i3', name: 'Sviečková na smotane', description: 'Knedľa, brusnice', price: 12.9 }],
    },
  ],
  allergenNote: 'Alergény: 1, 3, 7. Ďakujeme.',
  updatedAt: '',
  createdAt: '',
}

const header = (buf: Buffer | ArrayBuffer) => Buffer.from(buf).subarray(0, 5).toString('latin1')

describe('renderMenuPdf', () => {
  it('produces a structurally valid PDF for the SK locale', async () => {
    const buf = await renderMenuPdf(sampleMenu, 'sk')
    expect(header(buf)).toBe('%PDF-')
    expect(buf.toString('latin1')).toContain('%%EOF')
    expect(buf.length).toBeGreaterThan(1000)
  })

  it('embeds DM Sans (not the Helvetica fallback) so Slovak diacritics render', async () => {
    // Helvetica is Latin-1 only and cannot render č/š/ž/ľ/ô; the embedded font
    // name appears verbatim in the PDF, so we can assert the right face is used.
    const pdf = (await renderMenuPdf(sampleMenu, 'sk')).toString('latin1')
    expect(pdf).toMatch(/DMSans/)
    expect(pdf).not.toMatch(/Helvetica/)
  })

  it('renders the EN locale and reflects the actual content', async () => {
    const filled = await renderMenuPdf(sampleMenu, 'en')
    const empty = await renderMenuPdf({ ...sampleMenu, categories: [], allergenNote: null }, 'en')
    expect(header(filled)).toBe('%PDF-')
    expect(header(empty)).toBe('%PDF-')
    // A menu with dishes must embed more than the near-empty one - proof it
    // actually rendered the data rather than a static document.
    expect(filled.length).toBeGreaterThan(empty.length)
  })

  it('does not throw on edge cases (no categories, missing price, no allergen note)', async () => {
    const edge: DailyMenu = {
      id: 2,
      categories: [{ id: 'c', name: 'Nápoje', items: [{ id: 'i', name: 'Voda bez ceny' }] }],
      updatedAt: '',
      createdAt: '',
    }
    const buf = await renderMenuPdf(edge, 'sk')
    expect(header(buf)).toBe('%PDF-')
  })
})

describe('GET /menu/pdf route gating', () => {
  let payload: Payload
  let originalToggle: boolean | null | undefined

  const setToggle = (enableGuestDownload: boolean) =>
    payload.updateGlobal({
      slug: 'daily-menu',
      data: { enableGuestDownload },
      context: { disableRevalidate: true },
    })

  const call = (locale?: string) =>
    menuPdfRoute(new Request(`http://localhost/menu/pdf${locale ? `?locale=${locale}` : ''}`))

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const menu = await payload.findGlobal({ slug: 'daily-menu', depth: 0 })
    originalToggle = menu.enableGuestDownload
  })

  afterAll(async () => {
    await setToggle(originalToggle ?? false)
  })

  it('returns 404 while guest download is disabled', async () => {
    await setToggle(false)
    const res = await call('sk')
    expect(res.status).toBe(404)
  })

  it('serves a PDF with the SK filename and headers when enabled', async () => {
    await setToggle(true)
    const res = await call('sk')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/pdf')
    expect(res.headers.get('content-disposition')).toContain('jedalny-listok-sk.pdf')
    expect(header(await res.arrayBuffer())).toBe('%PDF-')
  })

  it('serves the EN filename for ?locale=en', async () => {
    await setToggle(true)
    const res = await call('en')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-disposition')).toContain('jedalny-listok-en.pdf')
  })
})
