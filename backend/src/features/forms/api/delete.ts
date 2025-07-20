import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { formsService } from '..'

const factory = createFactory()

export const deleteById = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }
    
    const owner_id = ctx.get('uid')
    const existingForm = await formsService.getById(form_id, owner_id)

    if (!existingForm) {
      throw ApiError.NotFound('Form not found')
    }

    const form = await formsService.delete(form_id, owner_id)

    return ctx.json(form)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})