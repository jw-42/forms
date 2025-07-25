import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import answersService from '../service'

const factory = createFactory()

export const getById = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const uid_str = ctx.req.param('user_id')
    const user_id = uid_str ? parseInt(uid_str) : null
    const current_user_id = ctx.get('uid')

    if (!user_id) {
      throw ApiError.BadRequest('user_id is required')
    }

    const answers = await answersService.getById(form_id, user_id, current_user_id)

    return ctx.json(answers)
  } catch (error) {
    console.log(error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})