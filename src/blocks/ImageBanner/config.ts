import type { Block } from 'payload'

export const ImageBanner: Block = {
  slug: 'imageBanner',
  interfaceName: 'ImageBannerBlock',
  labels: { singular: 'Obrázkový banner', plural: 'Obrázkové bannery' },
  admin: { group: 'Obsah' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overlayLabel',
      type: 'text',
      label: 'Nadštítok',
      localized: true,
    },
    {
      name: 'overlayHeading',
      type: 'text',
      label: 'Nadpis',
      localized: true,
      required: true,
      admin: {
        description: 'Text v hranatých zátvorkách [takto] sa zobrazí kurzívou.',
      },
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Malá (350px)', value: 'sm' },
        { label: 'Stredná (500px)', value: 'md' },
        { label: 'Veľká (700px)', value: 'lg' },
      ],
    },
  ],
}
