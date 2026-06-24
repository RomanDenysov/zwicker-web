import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

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
        description:
          'Vykreslí sa VEĽKÝMI písmenami. Nový riadok = zalomenie. Text v [zátvorkách] bude kurzívou.',
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
        { label: 'Extra veľká (900px)', value: 'xl' },
        { label: 'Na celú obrazovku', value: 'full' },
      ],
    },
    {
      name: 'overlayPosition',
      type: 'select',
      label: 'Umiestnenie textu',
      defaultValue: 'center',
      options: [
        { label: 'Na stred', value: 'center' },
        { label: 'Vľavo hore', value: 'centerLeft' },
        { label: 'Vpravo hore', value: 'topRight' },
      ],
    },
    {
      name: 'showCopyMark',
      type: 'checkbox',
      label: 'Zobraziť © vodoznak',
      defaultValue: false,
      admin: { description: 'Veľký © v pozadí (dekoratívny).' },
    },
    linkGroup({ appearances: false, overrides: { maxRows: 1 } }),
  ],
}
