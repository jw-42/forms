import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { submitAnswersSchema } from '../types'
import { submitAnswers } from '../service'
import { sendFormAnswerEvent } from '@infra/kafka/producer'

const factory = createFactory()

const submitAnswersHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    // Get user from context (assuming middleware sets it)
    const user_id = ctx.get('uid')
    if (!user_id) {
      throw ApiError.Unauthorized('User not authenticated')
    }

    const body = await ctx.req.json()
    const result = submitAnswersSchema.safeParse(body)
    
    if (!result.success) {
      throw ApiError.BadRequest(
        `One of the parameters is invalid or not provided: ${
          result.error?.errors.map(error => 
            `[${error.path.join('>')}]: ${error.message}`
          ).join('; ')
        }.`
      )
    }
    
    const response = await submitAnswers({
      ...result.data,
      form_id,
      user_id
    })

    // Kafka event
    await sendFormAnswerEvent({
      form_id,
      user_id,
      answer: response
    })
    
    return ctx.json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default submitAnswersHandler 