import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { deleteQuestion } from '../service'

const factory = createFactory()

const deleteQuestionHandler = factory.createHandlers(async (ctx: Context) => {
  try {
    const form_id = ctx.req.param('form_id')
    const question_id = ctx.req.param('question_id')
    
    if (!form_id || !question_id) {
      throw ApiError.BadRequest()
    }

    const deletedQuestionResult = await deleteQuestion(form_id, question_id)
    return ctx.json(deletedQuestionResult)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError.Internal()
  }
})

export default deleteQuestionHandler 