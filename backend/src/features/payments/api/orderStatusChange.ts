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

    if (status === 'chargeable') {
      // Получаем конфигурацию товара для правильного количества бустов
      const itemConfig = await paymentsService.getItemInfo(item_id)
      
      // Создаем транзакцию с правильными данными
      await paymentsService.upsertTransaction({
        external_id: order_id.toString(),
        user_id,
        type: 'purchase',
        status: 'completed',
        boosts_amount: itemConfig.boostAmount,
        votes_amount: 0,
        description: `Покупка ${itemConfig.boostAmount} бустов`,
        metadata: {
          vk_order_id: order_id,
          vk_item_id: item_id,
          vk_item_price: item_price,
          vk_status: status
        }
      })
      
      // Обрабатываем покупку (только обновление баланса)
      await paymentsService.processBoostPurchase(user_id, item_id)
    } else {
      // Создаем транзакцию для неуспешной операции
      await paymentsService.upsertTransaction({
        external_id: order_id.toString(),
        user_id,
        type: 'purchase',
        status: 'failed',
        boosts_amount: 0,
        votes_amount: 0,
        description: `Неуспешная покупка товара ${item_id}`,
        metadata: {
          vk_order_id: order_id,
          vk_item_id: item_id,
          vk_item_price: item_price,
          vk_status: status
        }
      })
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