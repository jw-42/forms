import { createFactory } from 'hono/factory'
import { ChangeSubscriptionStatus } from '../types'
import type { Context, Next } from 'hono'
import { verifySignature } from '@shared/utils'
import paymentsService from '../service'

const factory = createFactory()

export const subscriptionStatusChange = factory.createHandlers(async (ctx: Context, next: Next) => {
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    const body = await ctx.req.parseBody()
    console.log(`[SUBSCRIPTION-${requestId}] Входящие данные:`, JSON.stringify(body, null, 2))
    
    const result = ChangeSubscriptionStatus.safeParse({ ...body })

    if (!result.success) {
      console.error(`[SUBSCRIPTION-${requestId}] Ошибка валидации:`, result.error)
      return ctx.json({
        error: {
          error_code: 101,
          error_msg: 'Неверные параметры запроса',
          critical: true
        }
      })
    }

    console.log(`[SUBSCRIPTION-${requestId}] Данные валидированы успешно:`, JSON.stringify(result.data, null, 2))

    const secret = Bun.env.APP_SECRET
    if (!secret) {
      throw new Error('APP_SECRET is not set in environment')
    }

    if (!verifySignature(result.data, 'sig', secret)) {
      console.error(`[SUBSCRIPTION-${requestId}] Подпись неверная`)
      return ctx.json({
        error: {
          error_code: 10,
          error_msg: 'Неверная подпись',
          critical: true
        }
      })
    }

    console.log(`[SUBSCRIPTION-${requestId}] Подпись проверена успешно`)

    const {
      app_id,
      subscription_id,
      user_id,
      status,
      cancel_reason,
      item_id,
      item_price,
      next_bill_time,
      pending_cancel
    } = result.data

    if (app_id !== 53866259) {
      console.error(`[SUBSCRIPTION-${requestId}] Неподдерживаемое приложение: ${app_id}`)
      return ctx.json({
        error: {
          error_code: 100,
          error_msg: 'Это приложение не поддерживается',
          critical: true
        }
      })
    }

    console.log(`[SUBSCRIPTION-${requestId}] Создание/обновление подписки...`)
    // Создаем или обновляем подписку через service
    await paymentsService.createOrUpdateSubscription({
      subscription_id,
      user_id,
      status,
      cancel_reason,
      item_id,
      item_price,
      next_bill_time: next_bill_time ? new Date(next_bill_time * 1000) : new Date(),
      pending_cancel
    })

    console.log(`[SUBSCRIPTION-${requestId}] Подписка успешно обновлена`)

    return ctx.json({
      response: {
        subscription_id,
        app_order_id: subscription_id
      }
    })
  } catch (error) {
    console.error(`[SUBSCRIPTION-${requestId}] Ошибка:`, error)
    return ctx.json({
      error: {
        error_code: 1,
        error_msg: 'Ошибка обновления информации на сервере. Попробуйте ещё раз позже.',
        critical: true
      }
    })
  }
}) 