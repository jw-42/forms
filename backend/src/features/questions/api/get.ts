import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { questionsService } from '..'

const factory = createFactory()

export const get = factory.createHandlers(async(ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const current_user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const questions = await questionsService.getByFormId(form_id, current_user_id)

    return ctx.json(questions)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal()
    }
  }
})