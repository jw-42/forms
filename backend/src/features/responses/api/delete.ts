import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import answersService from '../service'

const factory = createFactory()

export const deleteByUserId = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const current_user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }
    
    const uid_str = ctx.req.param('user_id')
    const user_id = uid_str ? parseInt(uid_str) : null

    if (!user_id) {
      throw ApiError.BadRequest('user_id is required')
    }

    const answers = await answersService.deleteByUserId(form_id, user_id, current_user_id)

    return ctx.json({
      deleted: Boolean(answers.count > 0)
    })
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})