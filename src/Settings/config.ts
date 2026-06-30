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
            {
              type: 'collapsible',
              label: 'Štruktúrovaná adresa (pre SEO / mapy)',
              admin: {
                initCollapsed: true,
                description:
                  'Voliteľné. Vyplňte pre štruktúrované dáta (schema.org) - pomáha vo vyhľadávaní a mapách.',
              },
              fields: [
                { name: 'streetAddress', type: 'text', label: 'Ulica a číslo' },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'addressLocality',
                      type: 'text',
                      label: 'Mesto / obec',
                      admin: { width: '50%' },
                    },
                    { name: 'postalCode', type: 'text', label: 'PSČ', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'addressRegion',
                      type: 'text',
                      label: 'Kraj / región',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'addressCountry',
                      type: 'text',
                      label: 'Krajina (kód, napr. SK)',
                      defaultValue: 'SK',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'latitude',
                      type: 'number',
                      label: 'Zemepisná šírka (lat)',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      label: 'Zemepisná dĺžka (lng)',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
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
            {
              name: 'menuLink',
              type: 'group',
              label: 'Odkaz na jedálny lístok',
              admin: {
                hideGutter: true,
                description:
                  'Voliteľné. Interný odkaz na stránku s menu alebo vlastná URL - použije sa pre schema.org hasMenu (pomáha vo vyhľadávaní).',
              },
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  defaultValue: 'reference',
                  admin: { layout: 'horizontal' },
                  options: [
                    { label: 'Interný odkaz', value: 'reference' },
                    { label: 'Vlastná URL', value: 'custom' },
                  ],
                },
                {
                  name: 'reference',
                  type: 'relationship',
                  relationTo: ['pages'],
                  label: 'Stránka',
                  admin: { condition: (_, siblingData) => siblingData?.type === 'reference' },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Vlastná URL',
                  admin: { condition: (_, siblingData) => siblingData?.type === 'custom' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'priceRange',
                  type: 'text',
                  label: 'Cenová úroveň (napr. €€)',
                  admin: {
                    width: '50%',
                    description: 'Zobrazuje sa vo vyhľadávaní (schema.org priceRange)',
                  },
                },
                {
                  name: 'servesCuisine',
                  type: 'text',
                  label: 'Typ kuchyne (napr. Slovenská)',
                  localized: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
