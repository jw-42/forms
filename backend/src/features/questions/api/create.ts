import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { createQuestionSchema, questionsService } from '..'

const factory = createFactory()

export const create = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const body = await ctx.req.json()
    const result = createQuestionSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'One of the parameters is invalid or not provided',
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    const question = await questionsService.create(user_id, {
      form_id,
      ...result.data
    })

    return ctx.json(question)

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal()
    }
  }
})