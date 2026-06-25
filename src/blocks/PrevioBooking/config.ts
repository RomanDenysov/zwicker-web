import type { Block } from 'payload'

export const PrevioBooking: Block = {
  slug: 'previoBooking',
  interfaceName: 'PrevioBookingBlock',
  labels: { singular: 'Rezervácia (Previo)', plural: 'Rezervácie (Previo)' },
  admin: { group: 'Rezervácia' },
  fields: [
    { name: 'heading', type: 'text', label: 'Nadpis', localized: true },
    {
      name: 'hotId',
      type: 'text',
      label: 'Previo hotId',
      defaultValue: '784989',
      required: true,
      admin: { description: 'ID ubytovania v systéme Previo.' },
    },
    {
      name: 'language',
      type: 'select',
      label: 'Jazyk rezervácie',
      defaultValue: 'sk',
      options: [
        { label: 'Slovensky', value: 'sk' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Mena',
      defaultValue: 'EUR',
    },
    {
      name: 'height',
      type: 'number',
      label: 'Výška rámca (px)',
      defaultValue: 800,
      admin: { description: 'Minimálna výška vloženého rezervačného formulára.' },
    },
  ],
}
