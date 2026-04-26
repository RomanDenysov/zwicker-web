import type { Block } from 'payload'

export const EnSection: Block = {
  slug: 'enSection',
  interfaceName: 'EnSectionBlock',
  labels: { singular: 'Anglická sekcia (EN)', plural: 'Anglické sekcie' },
  admin: { group: 'Obsah' },
  fields: [
    { name: 'heading', type: 'text', label: 'Nadpis', defaultValue: 'English' },
    { name: 'body', type: 'textarea', label: 'Text', required: true },
  ],
}
