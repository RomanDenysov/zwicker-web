import type { Block } from 'payload'

export const PricingCards: Block = {
  slug: 'pricingCards',
  interfaceName: 'PricingCardsBlock',
  labels: { singular: 'Cenové karty', plural: 'Cenové karty' },
  admin: { group: 'Ubytovanie' },
  fields: [
    { name: 'note', type: 'text', label: 'Poznámka', localized: true },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'price', type: 'text', label: 'Cena', required: true },
        { name: 'label', type: 'text', label: 'Popis', localized: true, required: true },
      ],
    },
  ],
}
