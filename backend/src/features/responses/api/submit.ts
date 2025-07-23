import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { submitAnswersSchema } from '../types'
import answersService from '../service'
import { getAgreementHash } from '@shared/utils/get-agreement-hash'
import { formsService } from '@features/forms'

const factory = createFactory()

export const submit = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    const form = await formsService.getById(form_id, user_id)

    if (!form) {
      throw ApiError.NotFound('Form not found')
    }

    const body = await ctx.req.json()
    const result = submitAnswersSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'One of the parameters is invalid or not provided',
        result.error.issues
      )
    }

    const { url, hash } = await getAgreementHash(form.privacy_policy)    

    const { id } = await answersService.submit({
      form_id,
      user_id,
      answers: result.data.answers,
      agreement_url: url,
      agreement_hash: hash
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