import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { formsService } from '..'

const factory = createFactory()

export const getById = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    return ctx.json(form)
  } catch (error) {
    console.log(error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})