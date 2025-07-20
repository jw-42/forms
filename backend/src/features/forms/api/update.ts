import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { formsService, updateFormSchema } from '..'

const factory = createFactory()

export const update = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }
    
    const body = await ctx.req.json()
    const result = updateFormSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest()
    }
    const owner_id = ctx.get('uid')
    const existingForm = await formsService.getById(form_id, owner_id)

    if (!existingForm) {
      throw ApiError.NotFound('Form not found')
    }

    const form = await formsService.update(form_id, owner_id, result.data)

    return ctx.json(form)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})