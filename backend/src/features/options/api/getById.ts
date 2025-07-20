import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { formsService } from '@features/index'
import { questionsService } from '@features/questions'
import optionsService from '../service'

const factory = createFactory()

export const getById = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const qid_str = ctx.req.param('question_id')
    const oid_str = ctx.req.param('option_id')
    const question_id = qid_str ? parseInt(qid_str) : null
    const option_id = oid_str ? parseInt(oid_str) : null

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    } else if (!question_id || isNaN(question_id)) {
      throw ApiError.BadRequest('question_id must be a valid number')
    } else if (!option_id || isNaN(option_id)) {
      throw ApiError.BadRequest('option_id must be a valid number')
    }

    const user_id = ctx.get('uid')
    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    const question = await questionsService.getById(form_id, question_id, user_id)

    if (!question) {
      throw ApiError.NotFound('Question not found')
    }

    const option = await optionsService.getById(form_id, question_id, option_id, user_id)

    if (!option) {
      throw ApiError.NotFound('Option not found')
    }

    return ctx.json(option)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})