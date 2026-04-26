import { revalidateTag } from 'next/cache'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateDailyMenu: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating daily menu')
    revalidateTag('global_daily-menu', 'max')
  }
  return doc
}
