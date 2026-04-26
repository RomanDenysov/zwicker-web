import type { Block } from 'payload'

export const ContactCards: Block = {
  slug: 'contactCards',
  interfaceName: 'ContactCardsBlock',
  labels: { singular: 'Kontaktné karty', plural: 'Kontaktné karty' },
  admin: { group: 'Kontakt' },
  fields: [
    { name: 'sectionLabel', type: 'text', label: 'Štítok', localized: true },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'kind',
          type: 'select',
          label: 'Typ',
          defaultValue: 'address',
          options: [
            { label: 'Adresa', value: 'address' },
            { label: 'Telefón', value: 'phone' },
            { label: 'E-mail', value: 'email' },
            { label: 'Vlastný', value: 'custom' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Nadpis',
          localized: true,
          admin: { description: 'Ak je prázdne, použije sa typ.' },
        },
        { name: 'value', type: 'text', label: 'Hodnota', localized: true, required: true },
        { name: 'href', type: 'text', label: 'Odkaz (voliteľné)' },
      ],
    },
  ],
}
