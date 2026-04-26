import type { Block } from 'payload'

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter', plural: 'Newsletter bloky' },
  admin: { group: 'Kontakt' },
  fields: [
    { name: 'heading', type: 'text', label: 'Nadpis', localized: true, required: true },
    { name: 'body', type: 'textarea', label: 'Text', localized: true },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Popis tlačidla',
      localized: true,
      defaultValue: 'Odoberať',
    },
    { name: 'disclaimer', type: 'text', label: 'Právna poznámka', localized: true },
    {
      name: 'formEndpoint',
      type: 'text',
      label: 'URL formulára',
      admin: { description: 'Endpoint pre odoslanie e-mailu (POST).' },
    },
  ],
}
