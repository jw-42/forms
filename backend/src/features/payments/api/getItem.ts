import { createFactory } from 'hono/factory'
import { GetItemParams } from '../types'
import type { Context, Next } from 'hono'
import { verifySignature } from '@shared/utils'
import paymentsService from '../service'
import { ItemNotFoundError } from '@shared/utils/subscription-errors'

const factory = createFactory()

export const getItem = factory.createHandlers(async (ctx: Context, next: Next) => {
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    const body = await ctx.req.parseBody()
    console.log(`[GET-ITEM-${requestId}] Входящие данные:`, JSON.stringify(body, null, 2))
    
    const result = GetItemParams.safeParse({...body})

    if (!result.success) {
      console.error(`[GET-ITEM-${requestId}] Ошибка валидации:`, result.error)
      return ctx.json({
        error: {
          error_code: 101, 
          error_msg: 'Неверные параметры запроса',
          critical: true
        }
      })
    }

    console.log(`[GET-ITEM-${requestId}] Данные валидированы успешно:`, JSON.stringify(result.data, null, 2))

    const secret = Bun.env.APP_SECRET
    if (!secret) {
      throw new Error('APP_SECRET is not set in environment')
    }

    if (!verifySignature(result.data, 'sig', secret)) {
      console.error(`[GET-ITEM-${requestId}] Подпись неверная`)
      return ctx.json({
        error: {
          error_code: 10, 
          error_msg: 'Неверная подпись',
          critical: true
        }
      })
    }

    console.log(`[GET-ITEM-${requestId}] Подпись проверена успешно`)

    const { app_id, item } = result.data

    if (app_id !== 53866259) {
      console.error(`[GET-ITEM-${requestId}] Неподдерживаемое приложение: ${app_id}`)
      return ctx.json({
        error: {
          error_code: 100, 
          error_msg: 'Это приложение не поддерживается',
          critical: true
        }
      })
    }

    try {
      // Получаем информацию о товаре через service
      const itemInfo = await paymentsService.getItemInfo(item)
      console.log(`[GET-ITEM-${requestId}] Информация о товаре получена:`, JSON.stringify(itemInfo, null, 2))
      
      return ctx.json({
        response: itemInfo
      })
    } catch (error) {
      // Если товар не найден, возвращаем ошибку с кодом 20
      if (error instanceof ItemNotFoundError) {
        console.error(`[GET-ITEM-${requestId}] Товар не найден: ${item}`)
        return ctx.json({
          error: {
            error_code: 20, 
            error_msg: 'Такого товара не существует',
            critical: true
          }
        })
      }
      throw error
    }
  } catch (error) {
    console.error(`[GET-ITEM-${requestId}] Ошибка:`, error)
    return ctx.json({
      error: {
        error_code: 1, 
        error_msg: 'Ошибка обновления информации на сервере. Попробуйте ещё раз позже.',
        critical: false
      }
    })
  }
}) 