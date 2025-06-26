import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getAnswersByFormSchema } from '../types'
import { getAnswersGroupsByForm } from '../service'

const factory = createFactory()

const getAnswersByFormHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
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

    const result = getAnswersByFormSchema.safeParse({ form_id })
    
    if (!result.success) {
      throw ApiError.BadRequest()
    }
    
    const answers = await getAnswersGroupsByForm(form_id, user_id)
    return ctx.json(answers)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default getAnswersByFormHandler 