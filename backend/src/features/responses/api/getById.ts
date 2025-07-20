import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import answersService from '../service'

const factory = createFactory()

export const getById = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const answers_group_id = ctx.req.param('answers_group_id')
    const user_id = ctx.get('uid')

    if (!form_id || !answers_group_id) {
      throw ApiError.BadRequest('form_id and answers_group_id are required')
    }

    const answers = await answersService.getById(form_id, answers_group_id, user_id)

    return ctx.json(answers)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})