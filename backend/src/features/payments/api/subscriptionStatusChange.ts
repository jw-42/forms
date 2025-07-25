import { createFactory } from 'hono/factory'
import { ChangeSubscriptionStatus } from '../types'
import type { Context, Next } from 'hono'
import { verifySignature } from '@shared/utils'
import paymentsRepository from '../repository'

const factory = createFactory()

export const subscriptionStatusChange = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.parseBody()
    const result = ChangeSubscriptionStatus.safeParse({ ...body })

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
      return ctx.json({
        error: {
          error_code: 100,
          error_msg: 'Это приложение не поддерживается',
          critical: true
        }
      })
    }

    // Сохраняем или обновляем подписку
    let subscription = await paymentsRepository.getSubscriptionById(subscription_id)
    if (!subscription) {
      subscription = await paymentsRepository.createSubscription({
        subscription_id,
        user_id,
        status,
        cancel_reason,
        item_id,
        item_price,
        next_bill_time: next_bill_time ? new Date(next_bill_time * 1000) : new Date(),
        pending_cancel
      })
    } else {
      await paymentsRepository.updateSubscription(subscription_id, {
        status,
        cancel_reason,
        item_id,
        item_price,
        next_bill_time: next_bill_time ? new Date(next_bill_time * 1000) : new Date(),
        pending_cancel
      })
    }

    // Ответ VK
    return ctx.json({
      response: {
        subscription_id,
        app_order_id: subscription_id // Можно заменить на свой уникальный id заказа, если требуется
      }
    })
  } catch (error) {
    console.error(error)
    return ctx.json({
      error: {
        error_code: 1,
        error_msg: 'Ошибка обновления информации на сервере. Попробуйте ещё раз позже.',
        critical: true
      }
    })
  }
}) 