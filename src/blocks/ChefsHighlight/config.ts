import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const ChefsHighlight: Block = {
  slug: 'chefsHighlight',
  interfaceName: 'ChefsHighlightBlock',
  labels: { singular: 'Chef\'s Table (ukážka)', plural: 'Chef\'s Table bloky' },
  admin: { group: 'Reštaurácia' },
  fields: [
    {
      name: 'logo',
      type: 'text',
      label: 'Logo text',
      defaultValue: 'CHEF\'S TABLE',
      admin: { description: 'Použite © pre značkový accent.' },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Nadpis',
      localized: true,
      required: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      label: 'Citát',
      localized: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Text',
      localized: true,
    },
    {
      name: 'details',
      type: 'array',
      label: 'Detaily',
      labels: { singular: 'Detail', plural: 'Detaily' },
      maxRows: 3,
      fields: [
        { name: 'value', type: 'text', label: 'Hodnota', required: true },
        { name: 'label', type: 'text', label: 'Popis', localized: true, required: true },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Odznak na obrázku',
      localized: true,
    },
    linkGroup({ overrides: { maxRows: 1 } }),
  ],
}
