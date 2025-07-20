import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { formsService, getFormsSchema } from '..'

const factory = createFactory()

export const get = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const count = ctx.req.query('count')
    const offset = ctx.req.query('offset')    
    const user_id = ctx.get('uid')

    const result = getFormsSchema.safeParse({ count, offset })

    if (!result.success) {
      throw ApiError.BadRequest()
    }

    const forms = await formsService.get(user_id, result.data.count, result.data.offset)

    return ctx.json(forms)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})