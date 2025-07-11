import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { createMultipleOptionsSchema } from '../types'
import { createMultipleOptions } from '../service'

const factory = createFactory()

const createMultipleOptionsHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const question_id = ctx.req.param('question_id')
    if (!question_id) {
      throw ApiError.BadRequest('question_id is required')
    }

    const body = await ctx.req.json()
    const result = createMultipleOptionsSchema.safeParse(body)
    
    if (!result.success) {
      console.error(result.error)
      throw ApiError.BadRequest(
        'One of the parameters is invalid or not provided',
        result.error.errors.map((error) => ({
          path: error.path.join('.'),
          message: error.message
        }))
      )
    }
    
    const userId = ctx.get('uid')
    const options = await createMultipleOptions({
      ...result.data,
      question_id
    }, userId)
    return ctx.json(options)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default createMultipleOptionsHandler 