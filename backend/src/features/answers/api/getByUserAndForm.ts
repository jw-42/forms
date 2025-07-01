import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getAnswersByUserAndForm } from '../service'

const factory = createFactory()

const getByUserAndForm = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { user_id } = ctx.req.param()
    const form_id = ctx.req.param('form_id')
    const current_user_id = ctx.get('uid')
    
    if (!form_id || !user_id) {
      throw ApiError.BadRequest('Form ID and user ID are required')
    }
    
    const answers = await getAnswersByUserAndForm(
      form_id, 
      parseInt(user_id), 
      current_user_id
    )

    return ctx.json(answers)
  } catch (error) {
    console.error(error)
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default getByUserAndForm 