import type { Block } from 'payload'

export const ChefsCourseMenu: Block = {
  slug: 'chefsCourseMenu',
  interfaceName: 'ChefsCourseMenuBlock',
  labels: { singular: 'Degustačné menu (chody)', plural: 'Degustačné menu' },
  admin: { group: 'Reštaurácia' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'courses',
      type: 'array',
      minRows: 3,
      maxRows: 10,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', label: 'Názov chodu', localized: true, required: true },
        { name: 'description', type: 'text', label: 'Popis', localized: true },
      ],
    },
  ],
}
