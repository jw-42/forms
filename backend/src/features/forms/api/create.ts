import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { createFormSchema } from '../types'
import { ApiError } from '@shared/utils'
import formsService from '../service'

const factory = createFactory()

const createForm = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.json()
    const result = createFormSchema.safeParse(body)
    
    if (!result.success) {
      throw ApiError.BadRequest()
    }

    const owner_id = ctx.get('uid')
    const form = await formsService.createForm(owner_id, result.data)
    
    return ctx.json(form)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default createForm