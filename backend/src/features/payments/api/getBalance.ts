import { createFactory } from 'hono/factory'
import type { Context, Next } from 'hono'
import paymentsService from '../service'
import { AuthorizationMiddleware } from '@shared/middleware/authorization'

const factory = createFactory()

export const getBalance = factory.createHandlers(
  AuthorizationMiddleware,
  async (ctx: Context, next: Next) => {
    try {
      const user_id = ctx.get('uid') as number
      
      const balance = await paymentsService.getUserBalance(user_id)
      
      return ctx.json({
        balance
      })
    } catch (error) {
      console.error('Error getting balance:', error)
      return ctx.json({
        error: {
          error_code: 1,
          error_msg: 'Ошибка получения баланса. Попробуйте ещё раз позже.',
          critical: false
        }
      }, 500)
    }
  }
) 