import { createFactory } from 'hono/factory'
import type { Context, Next } from 'hono'
import paymentsService from '../service'
import { AuthorizationMiddleware } from '@shared/middleware/authorization'

const factory = createFactory()

export const getTransactions = factory.createHandlers(
  AuthorizationMiddleware,
  async (ctx: Context, next: Next) => {
    try {
      const user_id = ctx.get('uid') as number
      
      const transactions = await paymentsService.getUserTransactions(user_id)
      
      return ctx.json({
        transactions
      })
    } catch (error) {
      console.error('Error getting transactions:', error)
      return ctx.json({
        error: {
          error_code: 1,
          error_msg: 'Ошибка получения транзакций. Попробуйте ещё раз позже.',
          critical: false
        }
      }, 500)
    }
  }
) 