import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateRoom, revalidateRoomDelete } from './hooks/revalidateRoom'

export const Rooms: CollectionConfig<'rooms'> = {
  slug: 'rooms',
  labels: { singular: 'Izba', plural: 'Izby' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    priceFrom: true,
    shortDescription: true,
    heroImage: true,
    amenities: true,
  },
  admin: {
    defaultColumns: ['title', 'priceFrom', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'rooms',
          slug: data?.slug,
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'rooms',
        slug: data?.slug as string,
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Obsah',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Krátky popis',
              localized: true,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Popis',
              localized: true,
            },
          ],
        },
        {
          label: 'Cena & Rezervácia',
          fields: [
            {
              name: 'priceFrom',
              type: 'number',
              label: 'Cena od (€ / noc)',
              required: true,
            },
            {
              name: 'bookingUrl',
              type: 'text',
              label: 'Odkaz na rezerváciu (Previo)',
            },
          ],
        },
        {
          label: 'Vybavenie',
          fields: [
            {
              name: 'amenities',
              type: 'array',
              labels: { singular: 'Položka', plural: 'Položky vybavenia' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Názov',
                  localized: true,
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  label: 'Hodnota',
                  localized: true,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateRoom],
    afterDelete: [revalidateRoomDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
}
