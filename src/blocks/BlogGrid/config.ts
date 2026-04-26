import type { Block } from 'payload'

export const BlogGrid: Block = {
  slug: 'blogGrid',
  interfaceName: 'BlogGridBlock',
  labels: { singular: 'Mriežka príspevkov', plural: 'Mriežky príspevkov' },
  admin: { group: 'Blog' },
  fields: [
    { name: 'sectionLabel', type: 'text', label: 'Štítok', localized: true },
    {
      name: 'source',
      type: 'select',
      label: 'Zdroj príspevkov',
      defaultValue: 'latest',
      options: [
        { label: 'Najnovšie', value: 'latest' },
        { label: 'Vybrané', value: 'selected' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Počet',
      defaultValue: 3,
      min: 1,
      max: 9,
      admin: { condition: (_, s) => s?.source === 'latest' },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'selected' },
    },
  ],
}
