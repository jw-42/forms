import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getQuestionById } from '../service'

const factory = createFactory()

const getQuestionByIdHandler = factory.createHandlers(async (ctx: Context) => {
  try {
    const form_id = ctx.req.param('form_id')
    const question_id = ctx.req.param('question_id')
    
    if (!form_id || !question_id) {
      throw ApiError.BadRequest()
    }

    const question = await getQuestionById(form_id, question_id)
    return ctx.json(question)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError.Internal()
  }
})

export default getQuestionByIdHandler 