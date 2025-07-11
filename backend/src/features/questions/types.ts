import { z } from 'zod'

export const createQuestionSchema = z.object({
  type: z.enum(['text', 'radio']),
  text: z.string().min(3).max(64),
})

export const updateQuestionSchema = z.object({
  text: z.string().min(3).max(64),
})

export type CreateQuestionProps = z.infer<typeof createQuestionSchema> & { form_id: string }
export type UpdateQuestionProps = z.infer<typeof updateQuestionSchema>