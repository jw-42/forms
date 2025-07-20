import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { questionsService } from '..'

const factory = createFactory()

export const getById = factory.createHandlers(async(ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const qid_str = ctx.req.param('question_id')
    const question_id = qid_str ? parseInt(qid_str, 10) : null

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    } else if (!question_id || isNaN(question_id)) {
      throw ApiError.BadRequest('question_id must be a valid number')
    }

    const user_id = ctx.get('uid')

    const question = await questionsService.getById(form_id, question_id, user_id)

    return ctx.json(question)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal()
    }
  }
})