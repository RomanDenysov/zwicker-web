import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Room } from '../../../payload-types'

export const revalidateRoom: CollectionAfterChangeHook<Room> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/izby/${doc.slug}`
      payload.logger.info(`Revalidating room at path: ${path}`)
      revalidatePath(path)
      revalidatePath('/')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/izby/${previousDoc.slug}`
      revalidatePath(oldPath)
      revalidatePath('/')
    }
  }
  return doc
}

export const revalidateRoomDelete: CollectionAfterDeleteHook<Room> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    if (doc?.slug) revalidatePath(`/izby/${doc.slug}`)
    revalidatePath('/')
  }
  return doc
}
