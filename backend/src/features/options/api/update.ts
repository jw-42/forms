import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { formsService } from '@features/index'
import { updateOptionSchema } from '../types'
import optionsService from '../service'

const factory = createFactory()

export const update = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const user_id = ctx.get('uid')
    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    const qid_str = ctx.req.param('question_id')
    const question_id = qid_str ? parseInt(qid_str) : null

    if (!question_id) {
      throw ApiError.BadRequest('question_id is required')
    }

    const oid_str = ctx.req.param('option_id')
    const option_id = oid_str ? parseInt(oid_str) : null

    if (!option_id) {
      throw ApiError.BadRequest('option_id is required')
    }

    const body = await ctx.req.json()
    const result = updateOptionSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'One of the parameters is invalid or not provided',
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    const option = await optionsService.update(form_id, question_id, option_id, user_id, result.data)

    return ctx.json(option)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})