import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { createOptionsSchema } from '../types'
import optionsService from '../service'
import { formsService } from '@features/forms'

const factory = createFactory()

export const create = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

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

    const body = await ctx.req.json()
    console.log('body', body)
    const result = createOptionsSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'One of the parameters is invalid or not provided',
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    const options = await optionsService.create(form_id, user_id, {
      question_id,
      options: result.data.options
    })

    return ctx.json(options)

  } catch (error) {
    console.error(error)
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal()
    }
  }
})