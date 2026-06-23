import type { Block } from 'payload'

export const GalleryStrip: Block = {
  slug: 'galleryStrip',
  interfaceName: 'GalleryStripBlock',
  labels: { singular: 'Galéria (pás)', plural: 'Galéria (pásy)' },
  admin: { group: 'Obsah' },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Štítok sekcie',
      localized: true,
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Rozloženie',
      defaultValue: 'scroll',
      options: [
        { label: 'Koláž (statická mriežka)', value: 'collage' },
        { label: 'Pás (nekonečné posúvanie)', value: 'scroll' },
      ],
    },
    {
      name: 'background',
      type: 'select',
      label: 'Pozadie',
      defaultValue: 'default',
      options: [
        { label: 'Predvolené', value: 'default' },
        { label: 'Teplé (warm)', value: 'warm' },
        { label: 'Hnedé (brown)', value: 'brown' },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 4,
    },
    {
      name: 'scrollSpeed',
      type: 'select',
      label: 'Rýchlosť posúvania',
      defaultValue: 'normal',
      admin: {
        condition: (_, siblingData) => siblingData?.variant !== 'collage',
      },
      options: [
        { label: 'Pomalá (60s)', value: 'slow' },
        { label: 'Normálna (35s)', value: 'normal' },
        { label: 'Rýchla (20s)', value: 'fast' },
      ],
    },
  ],
}
