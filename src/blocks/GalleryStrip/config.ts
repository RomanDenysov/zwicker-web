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
      options: [
        { label: 'Pomalá (60s)', value: 'slow' },
        { label: 'Normálna (35s)', value: 'normal' },
        { label: 'Rýchla (20s)', value: 'fast' },
      ],
    },
  ],
}
