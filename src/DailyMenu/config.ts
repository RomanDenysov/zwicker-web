import type { GlobalConfig } from 'payload'

import { revalidateDailyMenu } from './hooks/revalidateDailyMenu'

export const DailyMenu: GlobalConfig = {
  slug: 'daily-menu',
  label: 'Denné menu',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateDailyMenu],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kategórie',
          fields: [
            {
              name: 'categories',
              type: 'array',
              labels: { singular: 'Kategória', plural: 'Kategórie' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Názov',
                  localized: true,
                  required: true,
                },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Položka', plural: 'Položky' },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Názov',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'text',
                      label: 'Popis',
                      localized: true,
                    },
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Cena (€)',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'PDF / Obrázok menu',
          fields: [
            {
              name: 'menuImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Obrázok menu (PDF export)',
            },
            {
              name: 'allergenNote',
              type: 'textarea',
              label: 'Poznámka o alergénoch',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
