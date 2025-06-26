import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { deleteAnswersGroupSchema } from '../types'
import { deleteAnswersGroup } from '../service'

const factory = createFactory()

const deleteAnswersGroupHandler = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const answers_group_id = ctx.req.param('answers_group_id')
    if (!answers_group_id) {
      throw ApiError.BadRequest('answers_group_id is required')
    }

    // Get user from context (assuming middleware sets it)
    const user_id = ctx.get('uid')
    if (!user_id) {
      throw ApiError.Unauthorized('User not authenticated')
    }

    const result = deleteAnswersGroupSchema.safeParse({ form_id, answers_group_id })
    
    if (!result.success) {
      throw ApiError.BadRequest()
    }
    
    const response = await deleteAnswersGroup(answers_group_id, user_id, form_id)
    return ctx.json(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default deleteAnswersGroupHandler 