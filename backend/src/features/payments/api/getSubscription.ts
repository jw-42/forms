import { ApiError } from '@shared/utils'
import { createFactory } from 'hono/factory'
import { GetSubscriptionParams } from '../types'
import type { Context, Next } from 'hono'
import { VKUrlDecode } from '@shared/utils'


const verifySignature = (params: GetSubscriptionParams) => {
  const { sig, ...rest } = params
  const restObj = rest as Record<string, unknown>
  const keys = Object.keys(restObj).sort()
  let baseString = ''
  for (const key of keys) {
    baseString += key + '=' + VKUrlDecode(String(restObj[key]))
  }
  baseString += Bun.env.APP_SECRET
  const hash = new Bun.CryptoHasher('md5').update(baseString).digest('hex')
  
  return hash === sig
}

const factory = createFactory()

export const getSubscription = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const params = ctx.req.query()
    const result = GetSubscriptionParams.safeParse(params)

    if (!result.success) {
      throw ApiError.BadRequest(
        'One or more parameters is invalid or not provided',
        result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    if (!verifySignature(result.data)) {
      throw ApiError.BadRequest('Invalid signature')
    }

    const { app_id, item } = result.data

    if (app_id !== 53866259) {
      throw ApiError.BadRequest('Unsupported app_id')
    }

    switch (item) {
      case 'vk_testers_30':
        return ctx.json({
          item_id: item,
          title: 'Премиум для участников VK Testers',
          description: 'Для участников программы бета-тестирования',
          period: 30,
          trial_duration: 3,
          price: 5,
          expiration: 0
        })

      default:
        throw ApiError.BadRequest('Unknown subscription type')
    }
  } catch (error) {
    console.error(error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})