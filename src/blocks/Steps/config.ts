import type { Block } from 'payload'

export const Steps: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Kroky (how it works)', plural: 'Kroky' },
  admin: { group: 'Obsah' },
  fields: [
    { name: 'heading', type: 'text', label: 'Nadpis', localized: true },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', label: 'Nadpis', localized: true, required: true },
        { name: 'body', type: 'textarea', label: 'Text', localized: true, required: true },
      ],
    },
  ],
}
