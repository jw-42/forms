import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { createQuestionSchema } from '../types'
import { createQuestion } from '../service'

const factory = createFactory()

const createQuestionHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const body = await ctx.req.json()
    const result = createQuestionSchema.safeParse(body)
    
    if (!result.success) {
      throw ApiError.BadRequest()
    }
    
    const question = await createQuestion({
      ...result.data,
      form_id
    })
    return ctx.json(question)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default createQuestionHandler