import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import formsService from '../service'

const factory = createFactory()

const deleteForm = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()
    
    if (!form_id) {
      throw ApiError.BadRequest()
    }
    
    const owner_id = ctx.get('uid')
    const existingForm = await formsService.getForm(form_id)
    
    if (!existingForm) {
      throw ApiError.NotFound()
    }

    const form = await formsService.deleteForm(form_id, owner_id)
    
    return ctx.json(form)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default deleteForm