import type { Context, Next } from 'hono'
import { ApiError } from '@shared/utils'
import paymentsService from '@features/payments/service'

export const SubscriptionCheckMiddleware = (requiredFeature?: string, requiredSubscription?: 'standard_30' | 'premium_30') => {
  return async (ctx: Context, next: Next) => {
    try {
      const user_id = ctx.get('uid')
      if (!user_id) {
        throw ApiError.Unauthorized('User not authorized')
      }

      let hasAccess = false

      if (requiredFeature) {
        hasAccess = await paymentsService.hasFeatureAccess(user_id, requiredFeature)
      } else if (requiredSubscription) {
        hasAccess = await paymentsService.hasActiveSubscription(user_id, requiredSubscription)
      } else {
        hasAccess = await paymentsService.hasAnyActiveSubscription(user_id)
      }

      if (!hasAccess) {
        throw ApiError.Forbidden('Subscription required')
      }

      await next()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      } else {
        throw ApiError.Internal()
      }
    }
  }
}

export const SubscriptionLimitMiddleware = (action: 'create_form' | 'add_question') => {
  return async (ctx: Context, next: Next) => {
    try {
      const user_id = ctx.get('uid')
      if (!user_id) {
        throw ApiError.Unauthorized('User not authorized')
      }

      let canPerform = false

      if (action === 'create_form') {
        const result = await paymentsService.canCreateForm(user_id)
        canPerform = result.canCreate
      } else if (action === 'add_question') {
        const formId = ctx.req.param('form_id')
        if (!formId) {
          throw ApiError.BadRequest('form_id is required for add_question action')
        }
        const result = await paymentsService.canAddQuestion(user_id, formId)
        canPerform = result.canAdd
      }

      if (!canPerform) {
        throw ApiError.Conflict('Limit exceeded')
      }

      await next()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      } else {
        throw ApiError.Internal()
      }
    }
  }
} 