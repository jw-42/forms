import { z } from 'zod'

export const MIN_QUESTION_TEXT_LENGTH = 3
export const MAX_QUESTION_TEXT_LENGTH = 64

export const MAX_QUESTIONS_PER_FORM = 5

export const createQuestionSchema = z.object({
  type: z.enum(['text', 'long_text', 'radio']),
  text: z.string()
    .min(MIN_QUESTION_TEXT_LENGTH)
    .max(MAX_QUESTION_TEXT_LENGTH),
})

export const updateQuestionSchema = z.object({
  text: z.string()
    .min(MIN_QUESTION_TEXT_LENGTH)
    .max(MAX_QUESTION_TEXT_LENGTH),
})

export type CreateQuestionProps = z.infer<typeof createQuestionSchema> & { form_id: string }
export type UpdateQuestionProps = z.infer<typeof updateQuestionSchema>