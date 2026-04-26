import type { Block } from 'payload'

export const MapSection: Block = {
  slug: 'mapSection',
  interfaceName: 'MapSectionBlock',
  labels: { singular: 'Mapa', plural: 'Mapy' },
  admin: { group: 'Kontakt' },
  fields: [
    { name: 'sectionLabel', type: 'text', label: 'Štítok', localized: true },
    { name: 'address', type: 'textarea', label: 'Adresa', localized: true },
    {
      name: 'embedSource',
      type: 'select',
      label: 'Zdroj embed kódu',
      defaultValue: 'settings',
      options: [
        { label: 'Z nastavení (Settings)', value: 'settings' },
        { label: 'Vlastný iframe', value: 'custom' },
      ],
    },
    {
      name: 'customEmbed',
      type: 'textarea',
      label: 'Vlastný iframe kód',
      admin: {
        condition: (_, siblingData) => siblingData?.embedSource === 'custom',
      },
    },
  ],
}
