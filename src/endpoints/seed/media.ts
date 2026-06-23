import path from 'path'

import type { Payload, PayloadRequest } from 'payload'

// Homepage photos live in public/assets (staged from the Figma reference).
// process.cwd() is the project root when the seed runs via the Next route.
const assetsDir = path.resolve(process.cwd(), 'public/assets')

export type MediaSpec = { key: string; file: string; alt: string }

/**
 * Uploads each spec'd file from public/assets into the `media` collection and
 * returns a { key -> id } map for referencing from page blocks. Each file is
 * uploaded once; reference the same key wherever a photo repeats.
 */
export const uploadMedia = async (
  payload: Payload,
  req: PayloadRequest,
  specs: MediaSpec[],
): Promise<Record<string, number>> => {
  const map: Record<string, number> = {}
  for (const spec of specs) {
    const doc = await payload.create({
      collection: 'media',
      req,
      depth: 0,
      context: { disableRevalidate: true },
      filePath: path.resolve(assetsDir, spec.file),
      data: { alt: spec.alt },
    })
    map[spec.key] = doc.id as number
  }
  return map
}

// Homepage photo set (§4b mapping in docs/homepage-redesign.md).
export const homeMediaSpecs: MediaSpec[] = [
  { key: 'heroFood', file: 'FOOD EXTENDED 01 1.jpg', alt: 'Prestreté jedlo na stole' },
  { key: 'restaurant', file: 'A7401829 1.jpg', alt: 'Reštaurácia Zwicker' },
  { key: 'pension', file: 'mesut-cicen-e9ajZPD_pp8-unsplash 1.jpg', alt: 'Izba penziónu Zwicker' },
  { key: 'wedding', file: 'stacey-vandas-c6w8Sef2EjM-unsplash 1.jpg', alt: 'Svadobná kytica' },
  { key: 'chefDark', file: 'chefs-table-3.jpg', alt: "Chef's Table degustačné menu" },
  { key: 'chef1', file: 'chefs-table-1.jpg', alt: "Chef's Table chod" },
  { key: 'chef2', file: 'chefs-table-2.jpg', alt: "Chef's Table chod" },
  { key: 'chef4', file: 'chefs-table-4.jpg', alt: 'Šéfkuchár pri plating-u' },
  { key: 'plate', file: 'A7401977 1.jpg', alt: 'Naservírovaný chod' },
  { key: 'food', file: 'allec-gomes-m0P0rG5f3zQ-unsplash 1.jpg', alt: 'Detail jedla' },
  { key: 'interier', file: 'yevhenii-deshko-siIcul9a33o-unsplash 1.jpg', alt: 'Interiér reštaurácie' },
  {
    key: 'venue1',
    file: 'zwicker_restaurant_500771563_18462549955075799_9200926908747870912_n 1.jpg',
    alt: 'Zwicker - atmosféra',
  },
  {
    key: 'venue2',
    file: 'zwicker_restaurant_515366213_18468658177075799_3278909614769770580_n 1.jpg',
    alt: 'Zwicker - atmosféra',
  },
  {
    key: 'venue3',
    file: 'zwicker_restaurant_529774316_18474982864075799_8355992219428512130_n 1.jpg',
    alt: 'Zwicker - atmosféra',
  },
  {
    key: 'venue4',
    file: 'zwicker_restaurant_530682560_18474982897075799_5889202760538078247_n 1.jpg',
    alt: 'Zwicker - atmosféra',
  },
  {
    key: 'venue5',
    file: 'zwicker_restaurant_539420279_18477286897075799_3973210490459933455_n 1.jpg',
    alt: 'Zwicker - atmosféra',
  },
  {
    key: 'venue6',
    file: 'zwicker_restaurant_539469563_18477286825075799_353047889952141608_n 1.jpg',
    alt: 'Zwicker - atmosféra',
  },
]
