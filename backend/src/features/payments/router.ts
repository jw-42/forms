import { Hono } from 'hono'
import { getSubscription, subscriptionStatusChange } from './api'

const router = new Hono()

router.post('/', async (ctx, next) => {
  const body = await ctx.req.parseBody()
  const notification_type = body.notification_type

  if (notification_type === 'get_subscription' || notification_type === 'get_subscription_test') {
    // @ts-ignore
    return getSubscription[0](ctx, next)
  }
  if (notification_type === 'subscription_status_change' || notification_type === 'subscription_status_change_test') {
    // @ts-ignore
    return subscriptionStatusChange[0](ctx, next)
  }
  return ctx.json({
    error: {
      error_code: 101,
      error_msg: 'Неизвестный тип уведомления',
      critical: true
    }
  })
})

export default router