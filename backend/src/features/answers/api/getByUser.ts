import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getAnswersGroupsByUser } from '../service'

const factory = createFactory()

const getAnswersByUserHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    // Get user from context (assuming middleware sets it)
    const user_id = ctx.get('uid')
    if (!user_id) {
      throw ApiError.Unauthorized('User not authenticated')
    }
    
    const answers = await getAnswersGroupsByUser(user_id)
    return ctx.json(answers)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default getAnswersByUserHandler 