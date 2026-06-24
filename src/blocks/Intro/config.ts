import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const Intro: Block = {
  slug: 'intro',
  interfaceName: 'IntroBlock',
  labels: { singular: 'Úvod (2-stĺpcový)', plural: 'Úvody' },
  admin: { group: 'Obsah' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nadpis',
      localized: true,
      required: true,
      admin: {
        description: 'Použite znak © na zvýraznenie časti textu značkovou farbou.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Text',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Pozícia obrázka',
      defaultValue: 'right',
      options: [
        { label: 'Vpravo', value: 'right' },
        { label: 'Vľavo', value: 'left' },
      ],
    },
    linkGroup({ overrides: { maxRows: 1 } }),
  ],
}
