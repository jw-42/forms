import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getAllOptions } from '../service'

const factory = createFactory()

const getAllOptionsHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const question_id = ctx.req.param('question_id')
    if (!question_id) {
      throw ApiError.BadRequest('question_id is required')
    }

    const options = await getAllOptions(question_id)
    return ctx.json(options)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default getAllOptionsHandler 