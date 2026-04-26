import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const MenuPreview: Block = {
  slug: 'menuPreview',
  interfaceName: 'MenuPreviewBlock',
  labels: { singular: 'Ukážka menu', plural: 'Ukážky menu' },
  admin: {
    group: 'Reštaurácia',
  },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Štítok sekcie',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Nadpis',
      localized: true,
      admin: {
        description: 'Newline rozdelí riadky. Druhý riadok bude kurzívou v značkovej farbe.',
      },
    },
    {
      name: 'categoriesLimit',
      type: 'number',
      label: 'Počet kategórií',
      defaultValue: 2,
      min: 1,
      max: 4,
    },
    {
      name: 'itemsPerCategory',
      type: 'number',
      label: 'Položiek na kategóriu',
      defaultValue: 3,
      min: 1,
      max: 10,
    },
    linkGroup({ overrides: { maxRows: 1 } }),
  ],
}
