import { Hono } from 'hono'
import { getItem, orderStatusChange } from './api'
import { AuthorizationMiddleware } from '@shared/middleware/authorization'
import { getBalance } from './api/getBalance'
import { getTransactions } from './api/getTransactions'

const router = new Hono()

router.post('/', async (ctx, next) => {
  const body = await ctx.req.parseBody()
  const notification_type = body.notification_type

  if (notification_type === 'get_item' || notification_type === 'get_item_test') {
    // @ts-ignore
    return getItem[0](ctx, next)
  }
  if (notification_type === 'order_status_change' || notification_type === 'order_status_change_test') {
    // @ts-ignore
    return orderStatusChange[0](ctx, next)
  }
  return ctx.json({
    error: {
      error_code: 101,
      error_msg: 'Неизвестный тип уведомления',
      critical: true
    }
  })
})

router.use('/balance', AuthorizationMiddleware)
router.get('/balance', ...getBalance)

router.use('/transactions', AuthorizationMiddleware)
router.get('/transactions', ...getTransactions)

export default router