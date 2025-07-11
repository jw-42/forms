import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { deleteOption } from '../service'

const factory = createFactory()

const deleteOptionHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const question_id = ctx.req.param('question_id')
    const option_id = ctx.req.param('option_id')
    
    if (!question_id) {
      throw ApiError.BadRequest('question_id is required')
    }
    
    if (!option_id) {
      throw ApiError.BadRequest('option_id is required')
    }

    const userId = ctx.get('uid')
    const result = await deleteOption(question_id, option_id, userId)
    return ctx.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default deleteOptionHandler 