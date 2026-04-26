import type { Block } from 'payload'

export const Pillars: Block = {
  slug: 'pillars',
  interfaceName: 'PillarsBlock',
  labels: { singular: 'Piliere', plural: 'Piliere' },
  admin: { group: 'Obsah' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Štítok sekcie',
      localized: true,
    },
    {
      name: 'background',
      type: 'select',
      label: 'Pozadie',
      defaultValue: 'dark',
      options: [
        { label: 'Tmavé', value: 'dark' },
        { label: 'Svetlé', value: 'light' },
      ],
    },
    {
      name: 'pillars',
      type: 'array',
      labels: { singular: 'Pilier', plural: 'Piliere' },
      minRows: 2,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Nadpis',
          localized: true,
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          label: 'Text',
          localized: true,
          required: true,
        },
      ],
    },
  ],
}
