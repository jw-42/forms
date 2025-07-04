import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { getAllAnswersByForm } from '../service'

const factory = createFactory()

const getAllByForm = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const current_user_id = ctx.get('uid')
    
    if (!form_id) {
      throw ApiError.BadRequest('Form ID is required')
    }
    
    const answers = await getAllAnswersByForm(form_id, current_user_id)

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

export default getAllByForm 