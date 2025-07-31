import { createFactory } from 'hono/factory'
import { OrderStatusChange } from '../types'
import type { Context, Next } from 'hono'
import { verifySignature } from '@shared/utils'
import paymentsService from '../service'

const factory = createFactory()

export const orderStatusChange = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.parseBody()
    const result = OrderStatusChange.safeParse({ ...body })

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
      order_id,
      user_id,
      status,
      item_id,
      item_price
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

    // Создаем или обновляем заказ через service
    await paymentsService.createOrUpdateOrder({
      order_id,
      user_id,
      status,
      item_id,
      item_price
    })

    // Если заказ оплачен, обрабатываем покупку бустов
    if (status === 'paid') {
      await paymentsService.processBoostPurchase(order_id, user_id, item_id)
    }

    return ctx.json({
      response: {
        order_id,
        app_order_id: order_id
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