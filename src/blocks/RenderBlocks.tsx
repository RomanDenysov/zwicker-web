import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BlogGridBlock } from '@/blocks/BlogGrid/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ChefsCourseMenuBlock } from '@/blocks/ChefsCourseMenu/Component'
import { ChefsHighlightBlock } from '@/blocks/ChefsHighlight/Component'
import { ChefsRowBlock } from '@/blocks/ChefsRow/Component'
import { ContactCardsBlock } from '@/blocks/ContactCards/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { DailyMenuImageBlock } from '@/blocks/DailyMenuImage/Component'
import { EnSectionBlock } from '@/blocks/EnSection/Component'
import { FamilyLunchCTABlock } from '@/blocks/FamilyLunchCTA/Component'
import { FeaturedPostBlock } from '@/blocks/FeaturedPost/Component'
import { GalleryStripBlock } from '@/blocks/GalleryStrip/Component'
import { ImageBannerBlock } from '@/blocks/ImageBanner/Component'
import { IntroBlock } from '@/blocks/Intro/Component'
import { MapSectionBlock } from '@/blocks/MapSection/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MenuPreviewBlock } from '@/blocks/MenuPreview/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { PillarsBlock } from '@/blocks/Pillars/Component'
import { PricingCardsBlock } from '@/blocks/PricingCards/Component'
import { RoomsGridBlock } from '@/blocks/RoomsGrid/Component'
import { StatsRowBlock } from '@/blocks/StatsRow/Component'
import { StepsBlock } from '@/blocks/Steps/Component'

const blockComponents = {
  archive: ArchiveBlock,
  blogGrid: BlogGridBlock,
  chefsCourseMenu: ChefsCourseMenuBlock,
  chefsHighlight: ChefsHighlightBlock,
  chefsRow: ChefsRowBlock,
  contactCards: ContactCardsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  dailyMenuImage: DailyMenuImageBlock,
  enSection: EnSectionBlock,
  familyLunchCTA: FamilyLunchCTABlock,
  featuredPost: FeaturedPostBlock,
  galleryStrip: GalleryStripBlock,
  imageBanner: ImageBannerBlock,
  intro: IntroBlock,
  mapSection: MapSectionBlock,
  mediaBlock: MediaBlock,
  menuPreview: MenuPreviewBlock,
  newsletter: NewsletterBlock,
  pillars: PillarsBlock,
  pricingCards: PricingCardsBlock,
  roomsGrid: RoomsGridBlock,
  statsRow: StatsRowBlock,
  steps: StepsBlock,
}

// Legacy template blocks have no internal vertical spacing; wrap them.
// Zwicker blocks handle their own section padding.
const legacyBlocks = new Set(['archive', 'content', 'cta', 'mediaBlock'])

type Block = NonNullable<Page['layout']>[number]

export const RenderBlocks: React.FC<{
  blocks: Page['layout']
}> = (props) => {
  const { blocks } = props

  if (!blocks || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block: Block, index) => {
        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]
          if (!Block) return null
          const isLegacy = legacyBlocks.has(blockType)
          return (
            <div key={index} className={isLegacy ? 'my-16' : ''}>
              {/* @ts-expect-error block type unions not narrowable by string key here */}
              <Block {...block} disableInnerContainer />
            </div>
          )
        }
        return null
      })}
    </Fragment>
  )
}
