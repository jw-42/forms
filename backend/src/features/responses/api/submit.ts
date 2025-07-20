import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { submitAnswersSchema } from '../types'
import answersService from '../service'

const factory = createFactory()

export const submit = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const body = await ctx.req.json()
    const result = submitAnswersSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'One of the parameters is invalid or not provided',
        result.error.issues
      )
    }

    const { id } = await answersService.submit({
      form_id,
      user_id,
      answers: result.data.answers
    })

    return ctx.json({ id })
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})