import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import paymentsService from '../service'

const factory = createFactory()

export const checkSubscription = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const user_id = ctx.get('uid')
    if (!user_id) {
      throw ApiError.Unauthorized('User not authorized')
    }

    const { feature, subscriptionType, action, formId } = await ctx.req.json()

    let result: any = {}

    if (feature) {
      // Проверка доступа к конкретной функции
      result.hasFeatureAccess = await paymentsService.hasFeatureAccess(user_id, feature)
    } else if (subscriptionType) {
      // Проверка наличия конкретной подписки
      result.hasSubscription = await paymentsService.hasActiveSubscription(user_id, subscriptionType)
    } else if (action) {
      // Проверка возможности выполнения действия
      switch (action) {
        case 'create_form':
          const formCheck = await paymentsService.canCreateForm(user_id)
          result.canCreateForm = formCheck.canCreate
          result.maxForms = formCheck.maxCount
          result.currentFormsCount = formCheck.currentCount
          break
        case 'add_question':
          if (!formId) {
            throw ApiError.BadRequest('formId is required for add_question action')
          }
          const questionCheck = await paymentsService.canAddQuestion(user_id, formId)
          result.canAddQuestion = questionCheck.canAdd
          result.maxQuestionsPerForm = questionCheck.maxCount
          result.currentQuestionsCount = questionCheck.currentCount
          break
        default:
          throw ApiError.BadRequest('Unknown action')
      }
    } else {
      // Полная информация о подписках пользователя
      const subscriptions = await paymentsService.getActiveSubscriptions(user_id, ['active', 'chargeable'])
      const activeTypes = await paymentsService.getActiveSubscriptionTypes(user_id)
      
      result = {
        hasAnySubscription: await paymentsService.hasAnyActiveSubscription(user_id),
        activeSubscriptionTypes: activeTypes,
        subscriptions: subscriptions,
        limits: {
          maxForms: await paymentsService.getUserMaxForms(user_id),
          maxQuestionsPerForm: await paymentsService.getUserMaxQuestionsPerForm(user_id)
        }
      }
    }

    return ctx.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
}) 