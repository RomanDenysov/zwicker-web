import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { BlogGrid } from '../../blocks/BlogGrid/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { ChefsCourseMenu } from '../../blocks/ChefsCourseMenu/config'
import { ChefsHighlight } from '../../blocks/ChefsHighlight/config'
import { ChefsRow } from '../../blocks/ChefsRow/config'
import { ContactCards } from '../../blocks/ContactCards/config'
import { Content } from '../../blocks/Content/config'
import { DailyMenuImage } from '../../blocks/DailyMenuImage/config'
import { EnSection } from '../../blocks/EnSection/config'
import { FamilyLunchCTA } from '../../blocks/FamilyLunchCTA/config'
import { FeaturedPost } from '../../blocks/FeaturedPost/config'
import { FormBlock } from '../../blocks/Form/config'
import { GalleryStrip } from '../../blocks/GalleryStrip/config'
import { ImageBanner } from '../../blocks/ImageBanner/config'
import { Intro } from '../../blocks/Intro/config'
import { MapSection } from '../../blocks/MapSection/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MenuPreview } from '../../blocks/MenuPreview/config'
import { Newsletter } from '../../blocks/Newsletter/config'
import { Pillars } from '../../blocks/Pillars/config'
import { PricingCards } from '../../blocks/PricingCards/config'
import { RoomsGrid } from '../../blocks/RoomsGrid/config'
import { StatsRow } from '../../blocks/StatsRow/config'
import { Steps } from '../../blocks/Steps/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                Intro,
                Pillars,
                ImageBanner,
                MenuPreview,
                ChefsHighlight,
                RoomsGrid,
                FamilyLunchCTA,
                GalleryStrip,
                Steps,
                ChefsCourseMenu,
                ChefsRow,
                StatsRow,
                PricingCards,
                ContactCards,
                MapSection,
                EnSection,
                FeaturedPost,
                BlogGrid,
                Newsletter,
                DailyMenuImage,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
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
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
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
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
