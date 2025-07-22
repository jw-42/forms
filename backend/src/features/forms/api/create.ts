import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { createFormSchema, formsService } from '..'
import { sendNewFormEvent } from '@infra/kafka/producer'
import { getAgreementHash } from '@shared/utils/get-agreement-hash'

const factory = createFactory()

export const create = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.json()
    const result = createFormSchema.safeParse(body)
    
    if (!result.success) {
      throw ApiError.BadRequest(
        'One or more parameters is invalid or not provided',
        result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    // const { legal } = result.data

    // const {
    //   url,
    //   hash
    // } = await getAgreementHash(legal.agreement_url)

    const owner_id = ctx.get('uid')
    const form = await formsService.create(owner_id, result.data)

    if (!!form) {
      void sendNewFormEvent({
        form_id: form.id,
        title: form.title as string,
        owner_id: form.owner_id as number
      })
    }
    
    return ctx.json(form)
  } catch (error) {
    console.error(error)
    if (error instanceof ApiError) {
      throw error
    } else {
      throw ApiError.Internal()
    }
  }
})