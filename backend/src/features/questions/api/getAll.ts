import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getAllQuestions } from '../service'

const factory = createFactory()

const getAllQuestionsHandler = factory.createHandlers(async (ctx: Context) => {
  try {
    const form_id = ctx.req.param('form_id')
    
    if (!form_id) {
      console.log('form_id is required', form_id)
      throw ApiError.BadRequest()
    }

    const questions = await getAllQuestions(form_id)
    return ctx.json(questions)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError.Internal()
  }
})

export default getAllQuestionsHandler 