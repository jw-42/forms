import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import paymentsService from '../service'

const factory = createFactory()

export const getActiveSubscriptions = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const user_id = ctx.get('uid')
    if (!user_id) {
      throw ApiError.Unauthorized('User not authorized')
    }
    const subscriptions = await paymentsService.getActiveSubscriptions(user_id)
    return ctx.json(subscriptions)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
}) 