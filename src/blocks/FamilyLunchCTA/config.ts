import type { Block } from 'payload'

export const FamilyLunchCTA: Block = {
  slug: 'familyLunchCTA',
  interfaceName: 'FamilyLunchCTABlock',
  labels: { singular: 'Rodinný obed (CTA)', plural: 'Rodinný obed CTA' },
  admin: { group: 'Reštaurácia' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nadpis',
      localized: true,
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Text',
      localized: true,
    },
    {
      name: 'courses',
      type: 'array',
      label: 'Chody',
      labels: { singular: 'Chod', plural: 'Chody' },
      maxRows: 6,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Názov',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Poznámka',
      localized: true,
    },
    {
      name: 'priceAdult',
      type: 'text',
      label: 'Cena (dospelá osoba)',
      admin: { description: 'Napr. "39 €"' },
    },
    {
      name: 'priceAdultLabel',
      type: 'text',
      label: 'Popis pri cene dospelého',
      localized: true,
      defaultValue: '/ dospelá osoba',
    },
    {
      name: 'priceChild',
      type: 'text',
      label: 'Cena (dieťa)',
      localized: true,
      admin: { description: 'Napr. "17 € / dieťa do 10 rokov"' },
    },
  ],
}
