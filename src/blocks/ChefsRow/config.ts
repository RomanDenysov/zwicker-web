import type { Block } from 'payload'

export const ChefsRow: Block = {
  slug: 'chefsRow',
  interfaceName: 'ChefsRowBlock',
  labels: { singular: 'Šéfkuchári', plural: 'Šéfkuchári' },
  admin: { group: 'Reštaurácia' },
  fields: [
    { name: 'sectionLabel', type: 'text', label: 'Štítok', localized: true },
    {
      name: 'chefs',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      admin: { initCollapsed: true },
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', label: 'Meno', required: true },
        { name: 'role', type: 'text', label: 'Pozícia', localized: true, required: true },
        { name: 'bio', type: 'textarea', label: 'Krátky popis', localized: true },
      ],
    },
  ],
}
