import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { formsService } from '..'
import { openRouterClient } from '@infra/openrouter'
import { z } from 'zod'

const factory = createFactory()

const generateDescriptionSchema = z.object({
  form_title: z.string().min(3).max(100)
})

export const generateDescription = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.json()
    const result = generateDescriptionSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'Invalid request parameters',
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    const { form_title } = result.data

    const description = await openRouterClient().generateFormDescription(form_title)

    return ctx.json({
      description,
      generated: true
    })

  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    } else {
      console.error('Generate description error:', error)
      throw ApiError.Internal('Failed to generate description')
    }
  }
})