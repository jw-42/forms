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
    const body = await ctx.req.parseBody()
    const result = GetSubscriptionParams.safeParse(body)

    if (!result.success) {
      return ctx.json({
        error: {
          error_code: 101, 
          error_msg: `Неверные параметры запроса: ${JSON.stringify(result.error.issues)}`,
          critical: true
        }
      })
    }

    if (!verifySignature(result.data)) {
      return ctx.json({
        error: {
          error_code: 10, 
          error_msg: 'Неверная подпись',
          critical: true
        }
      })
    }

    const { app_id, item } = result.data

    if (app_id !== 53866259) {
      return ctx.json({
        error: {
          error_code: 100, 
          error_msg: 'Это приложение не поддерживается',
          critical: true
        }
      })
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
        return ctx.json({
          error: {
            error_code: 20, 
            error_msg: 'Такой подписки не существует',
            critical: true
          }
        })
    }
  } catch (error) {
    console.error(error)
    console.log(JSON.stringify(error))
    return ctx.json({
      error: {
        error_code: 1, 
        error_msg: 'Ошибка обновления информации на сервере. Попробуйте ещё раз позже.',
        critical: false
      }
    })
  }
})