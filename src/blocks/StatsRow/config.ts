import type { Block } from 'payload'

export const StatsRow: Block = {
  slug: 'statsRow',
  interfaceName: 'StatsRowBlock',
  labels: { singular: 'Štatistiky (riadok)', plural: 'Štatistiky' },
  admin: { group: 'Obsah' },
  fields: [
    { name: 'sectionLabel', type: 'text', label: 'Štítok', localized: true },
    { name: 'heading', type: 'text', label: 'Nadpis', localized: true },
    { name: 'body', type: 'textarea', label: 'Text', localized: true },
    {
      name: 'stats',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'value', type: 'text', label: 'Hodnota', required: true },
        { name: 'label', type: 'text', label: 'Popis', localized: true, required: true },
      ],
    },
  ],
}
