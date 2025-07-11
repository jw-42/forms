import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { createOptionSchema } from '../types'
import { createOption } from '../service'

const factory = createFactory()

const createOptionHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const question_id = ctx.req.param('question_id')
    if (!question_id) {
      throw ApiError.BadRequest('question_id is required')
    }

    const body = await ctx.req.json()
    const result = createOptionSchema.safeParse(body)
    
    if (!result.success) {
      throw ApiError.BadRequest()
    }
    
    const userId = ctx.get('uid')
    const option = await createOption({
      ...result.data,
      question_id
    }, userId)
    return ctx.json(option)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default createOptionHandler 