import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { formsService } from '..'

const factory = createFactory()

export const getPersonalDataAgreement = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const { form_id } = ctx.req.param()
    const user_id = ctx.get('uid')
    const user_ids_str = ctx.req.query('user_ids')
    const user_ids = user_ids_str ? user_ids_str.split(',').map(Number) : undefined

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const agreements = await formsService.getPersonalDataAgreements(form_id, user_id, user_ids)

    if (!agreements) {
      throw ApiError.NotFound('Personal data agreements not found')
    }

    return ctx.json(agreements)
  } catch (error) {
    console.log(error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})