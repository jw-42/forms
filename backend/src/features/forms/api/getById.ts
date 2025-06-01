import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import formsService from '../service'

const factory = createFactory()

const getById = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()
    
    if (!form_id) {
      throw ApiError.BadRequest()
    }
    
    const form = await formsService.getForm(form_id)

    if (!form) {
      throw ApiError.NotFound()
    }
    
    return ctx.json(form)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default getById