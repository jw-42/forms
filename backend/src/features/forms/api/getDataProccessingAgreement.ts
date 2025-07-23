import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { formsService } from '..'

const factory = createFactory()

export const getDataProccessingAgreement = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const agreement = await formsService.getDataProccessingAgreement(form_id, user_id)

    if (!agreement) {
      throw ApiError.NotFound('Data processing agreement not found')
    }

    return ctx.json(agreement)
  } catch (error) {
    console.log(error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})