import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const RoomsGrid: Block = {
  slug: 'roomsGrid',
  interfaceName: 'RoomsGridBlock',
  labels: { singular: 'Mriežka izieb', plural: 'Mriežky izieb' },
  admin: { group: 'Ubytovanie' },
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
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Text',
      localized: true,
    },
    {
      name: 'rooms',
      type: 'relationship',
      relationTo: 'rooms',
      hasMany: true,
      required: true,
      admin: { description: 'Ak necháte prázdne, zobrazia sa všetky publikované izby.' },
    },
    linkGroup({ overrides: { maxRows: 1 } }),
  ],
}
