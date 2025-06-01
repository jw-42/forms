import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getFormsSchema } from '../types'
import formsService from '../service'

const factory = createFactory()

const getAll = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const count = ctx.req.query('count')
    const offset = ctx.req.query('offset')
    const user_id = ctx.get('uid')

    const result = getFormsSchema.safeParse({
      count: count ? parseInt(count) : 10,
      offset: offset ? parseInt(offset) : 0
    })
    
    if (!result.success) {
      throw ApiError.BadRequest()
    }
    
    const forms = await formsService.getAllForms(user_id, result.data.count, result.data.offset)
    
    return ctx.json(forms)
  } catch (error) {
    console.error(error)
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default getAll