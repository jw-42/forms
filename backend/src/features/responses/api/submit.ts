import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { submitAnswersSchema } from '../types'
import answersService from '../service'
import { getAgreementHash } from '@shared/utils/get-agreement-hash'
import { formsService } from '@features/forms'
import { questionsService } from '@features/questions'

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

    // Получаем все вопросы формы для валидации
    const questions = await questionsService.getByFormId(form_id, user_id)
    const requiredQuestions = questions.filter(q => q.required)
    const submittedQuestionIds = new Set(result.data.answers.map(a => a.question_id))
    const allQuestionIds = new Set(questions.map(q => q.id))

    // Проверяем, что все обязательные вопросы имеют ответы
    const missingRequiredAnswers = requiredQuestions.filter(q => 
      !result.data.answers.some(a => a.question_id === q.id && a.value && a.value.trim() !== '')
    )

    if (missingRequiredAnswers.length > 0) {
      throw ApiError.BadRequest(
        'Required questions must be answered',
        missingRequiredAnswers.map(q => ({ question_id: q.id, text: q.text }))
      )
    }

    // Проверяем, что все вопросы формы включены в ответы
    const missingQuestions = questions.filter(q => !submittedQuestionIds.has(q.id))
    if (missingQuestions.length > 0) {
      // Добавляем пустые ответы для неотвеченных вопросов
      const missingAnswers = missingQuestions.map(q => ({
        question_id: q.id,
        value: undefined
      }))
      result.data.answers.push(...missingAnswers)
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