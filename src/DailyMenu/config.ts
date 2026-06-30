import type { GlobalConfig } from 'payload'

import { generateMenuPdf } from './endpoints/generatePdf'
import { revalidateDailyMenu } from './hooks/revalidateDailyMenu'

export const DailyMenu: GlobalConfig = {
  slug: 'daily-menu',
  label: 'Denné menu',
  access: {
    read: () => true,
  },
  endpoints: [generateMenuPdf],
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
              name: 'enableGuestDownload',
              type: 'checkbox',
              label: 'Povoliť stiahnutie PDF pre návštevníkov',
              defaultValue: false,
              admin: {
                description:
                  'Zobrazí na webe tlačidlo „Stiahnuť jedálny lístok (PDF)“. PDF sa generuje z kategórií a položiek nižšie.',
              },
            },
            {
              name: 'generatePdf',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/DailyMenu/admin/GenerateMenuPdfButton#GenerateMenuPdfButton',
                },
              },
            },
            {
              name: 'menuPdf',
              type: 'upload',
              relationTo: 'media',
              label: 'Vygenerované PDF menu',
              admin: {
                readOnly: true,
                description: 'Automaticky nastavené tlačidlom „Generovať PDF“.',
              },
            },
            {
              name: 'menuImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Obrázok menu (ručne nahraný)',
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
