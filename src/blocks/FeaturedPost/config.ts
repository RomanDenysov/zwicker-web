import type { Block } from 'payload'

export const FeaturedPost: Block = {
  slug: 'featuredPost',
  interfaceName: 'FeaturedPostBlock',
  labels: { singular: 'Hlavný príspevok', plural: 'Hlavné príspevky' },
  admin: { group: 'Blog' },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
  ],
}
