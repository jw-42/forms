import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { updateQuestionSchema } from '../types'
import { updateQuestion } from '../service'

const factory = createFactory()

const updateQuestionHandler = factory.createHandlers(async (ctx: Context) => {
  try {
    const form_id = ctx.req.param('form_id')
    const question_id = ctx.req.param('question_id')
    
    const body = await ctx.req.json()
    const updateResult = updateQuestionSchema.safeParse(body)
    
    if (!form_id || !question_id || !updateResult.success) {
      console.log(updateResult.error?.errors)
      throw ApiError.BadRequest(
        `One of the parameters is invalid or not provided: ${
          updateResult.error?.errors.map(error => 
            `[${error.path[0]}]: ${error.message}`
          ).join('; ')
        }.`
      )
    }

    const question = await updateQuestion(
      form_id,
      question_id,
      updateResult.data
    )
    return ctx.json(question)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw ApiError.Internal()
  }
})

export default updateQuestionHandler 