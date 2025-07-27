import { createFactory } from 'hono/factory'
import { GetSubscriptionParams } from '../types'
import type { Context, Next } from 'hono'
import { verifySignature } from '@shared/utils'
import paymentsService from '../service'
import { SubscriptionNotFoundError } from '@shared/utils/subscription-errors'

const factory = createFactory()

export const getSubscription = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.parseBody()
    const result = GetSubscriptionParams.safeParse({...body})

    if (!result.success) {
      return ctx.json({
        error: {
          error_code: 101, 
          error_msg: 'Неверные параметры запроса',
          critical: true
        }
      })
    }

    const secret = Bun.env.APP_SECRET
    if (!secret) {
      throw new Error('APP_SECRET is not set in environment')
    }

    if (!verifySignature(result.data, 'sig', secret)) {
      return ctx.json({
        error: {
          error_code: 10, 
          error_msg: 'Неверная подпись',
          critical: true
        }
      })
    }

    const { app_id, item } = result.data

    if (app_id !== 53866259) {
      return ctx.json({
        error: {
          error_code: 100, 
          error_msg: 'Это приложение не поддерживается',
          critical: true
        }
      })
    }

    try {
      // Получаем информацию о подписке через service
      const subscriptionInfo = await paymentsService.getSubscriptionInfo(item)
      
      return ctx.json({
        response: subscriptionInfo
      })
    } catch (error) {
      // Если товар не найден, возвращаем ошибку с кодом 20
      if (error instanceof SubscriptionNotFoundError) {
        return ctx.json({
          error: {
            error_code: 20, 
            error_msg: 'Такой подписки не существует',
            critical: true
          }
        })
      }
      throw error
    }
  } catch (error) {
    console.error(error)
    console.log(JSON.stringify(error))
    return ctx.json({
      error: {
        error_code: 1, 
        error_msg: 'Ошибка обновления информации на сервере. Попробуйте ещё раз позже.',
        critical: false
      }
    })
  }
})