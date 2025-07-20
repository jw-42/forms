import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { formsService } from '@features/forms'
import { questionsService, updateQuestionSchema } from '..'

const factory = createFactory()

export const update = factory.createHandlers(async(ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const qid_str = ctx.req.param('question_id')
    const question_id = qid_str ? parseInt(qid_str) : null

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    } else if (!question_id || isNaN(question_id)) {
      throw ApiError.BadRequest('question_id must be a valid number')
    }

    const user_id = ctx.get('uid')
    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const question = await questionsService.getById(form_id, question_id, user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    }

    const body = await ctx.req.json()
    const result = updateQuestionSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest('Invalid request body', result.error.issues)
    }

    const updated_question = await questionsService.update(form_id, question_id, user_id, result.data)

    return ctx.json(updated_question)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal()
    }
  }
})