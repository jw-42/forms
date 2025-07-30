import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { formsService } from '@features/forms'
import { questionsService } from '..'
import { openRouterClient } from '@infra/openrouter'
import { z } from 'zod'

const factory = createFactory()

const generateDescriptionSchema = z.object({
  questionText: z.string().min(3).max(64),
  questionType: z.enum(['text', 'long_text', 'radio'])
})

export const generateDescription = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const form_id = ctx.req.param('form_id')
    const qid_str = ctx.req.param('question_id')
    const question_id = qid_str ? parseInt(qid_str) : null
    const user_id = ctx.get('uid')

    if (!form_id) {
      throw ApiError.BadRequest('form_id is required')
    }

    // Check if user has access to the form
    const form = await formsService.getById(form_id, user_id)
    if (!form) {
      throw ApiError.NotFound('Form not found')
    } else if (form.can_edit !== true) {
      throw ApiError.Forbidden()
    }

    // If question_id is provided, verify it exists
    if (question_id && !isNaN(question_id)) {
      const question = await questionsService.getById(form_id, question_id, user_id)
      if (!question) {
        throw ApiError.NotFound('Question not found')
      }
    }

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

    const { questionText, questionType } = result.data

    // Generate description using OpenRouter
    const description = await openRouterClient.generateQuestionDescription(questionText, questionType)

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