import { Font } from '@react-pdf/renderer'
import path from 'path'

/**
 * Register DM Sans (static TTF, `latin-ext`) for PDF rendering.
 *
 * The bundled Helvetica uses Latin-1 and cannot render Slovak diacritics
 * (č/š/ž/ť/ď/ľ/ň/ŕ/ô), so a TTF with full coverage is required. The TTF files
 * are traced into the serverless function via `outputFileTracingIncludes`
 * (see `next.config.ts`).
 */
let registered = false

export function registerPdfFonts() {
  if (registered) return

  const dir = path.join(process.cwd(), 'src/DailyMenu/pdf/fonts')

  Font.register({
    family: 'DM Sans',
    fonts: [
      { src: path.join(dir, 'DMSans-Regular.ttf'), fontWeight: 400 },
      { src: path.join(dir, 'DMSans-Medium.ttf'), fontWeight: 500 },
      { src: path.join(dir, 'DMSans-Bold.ttf'), fontWeight: 700 },
    ],
  })

  // Disable hyphenation so dish names are not broken mid-word.
  Font.registerHyphenationCallback((word) => [word])

  registered = true
}
