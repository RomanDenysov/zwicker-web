import { GlobalConfig } from 'payload'
import { revalidateSettings } from './hooks/revalidateSettings'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Nastavenia',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Otváracie hodiny',
          fields: [
            {
              name: 'openingHours',
              type: 'array',
              labels: { singular: 'Riadok', plural: 'Riadky' },
              fields: [
                {
                  name: 'days',
                  type: 'text',
                  label: 'Dni (napr. Ut - Pi)',
                  required: true,
                  localized: true,
                },
                {
                  name: 'hours',
                  type: 'text',
                  label: 'Hodiny (napr. 11:00 - 22:00)',
                  required: true,
                },
              ],
            },
            {
              name: 'closedNote',
              type: 'text',
              label: 'Poznámka o uzavretí (napr. sviatky)',
              localized: true,
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            { name: 'phone', type: 'text', label: 'Telefón' },
            { name: 'email', type: 'email', label: 'E-mail' },
            {
              name: 'reservationEmail',
              type: 'email',
              label: 'E-mail pre rezervácie',
              admin: {
                description: 'Formulár rezervácií posiela sem',
              },
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Adresa',
              localized: true,
            },
            { name: 'googleMapsUrl', type: 'text', label: 'Google Maps URL' },
            {
              name: 'googleMapsEmbed',
              type: 'textarea',
              label: 'Google Maps embed iframe',
              admin: { description: 'Skopírujte iframe kód z Google Maps → Zdieľať → Vložiť mapu' },
            },
          ],
        },
        {
          label: 'Sociálne siete',
          fields: [
            { name: 'instagram', type: 'text', label: 'Instagram URL' },
            { name: 'facebook', type: 'text', label: 'Facebook URL' },
          ],
        },
        {
          label: 'SEO / OG',
          fields: [
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Predvolený OG obrázok',
              admin: {
                description:
                  'Zobrazuje sa pri zdieľaní na sociálnych sieťach, ak stránka nemá vlastný',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Predvolený popis webu',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
