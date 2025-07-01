import { z } from 'zod'

export const submitAnswersSchema = z.object({
  answers: z.array(z.object({
    question_id: z.string(),
    value: z.string().max(1000)
  })).min(1)
})

export const getAnswersByFormSchema = z.object({
  form_id: z.string().uuid()
})

export const getAnswersGroupByIdSchema = z.object({
  form_id: z.string().uuid(),
  answers_group_id: z.string().uuid()
})

export const deleteAnswersGroupSchema = z.object({
  form_id: z.string().uuid(),
  answers_group_id: z.string().uuid()
})

export const getAnswersSummarySchema = z.object({
  form_id: z.string().uuid()
})

export const getQuestionSummarySchema = z.object({
  form_id: z.string().uuid(),
  question_id: z.string().uuid()
})

export const getAnswersByUserAndFormSchema = z.object({
  form_id: z.string().uuid(),
  user_id: z.number()
})

export const getAllAnswersByFormSchema = z.object({
  form_id: z.string().uuid()
})

export const deleteAnswersByUserOnFormSchema = z.object({
  form_id: z.string().uuid(),
  user_id: z.number()
})

export type SubmitAnswersProps = z.infer<typeof submitAnswersSchema> & { 
  form_id: string
  user_id: number 
}
export type GetAnswersByFormProps = z.infer<typeof getAnswersByFormSchema>
export type GetAnswersGroupByIdProps = z.infer<typeof getAnswersGroupByIdSchema>
export type DeleteAnswersGroupProps = z.infer<typeof deleteAnswersGroupSchema>
export type GetAnswersSummaryProps = z.infer<typeof getAnswersSummarySchema>
export type GetQuestionSummaryProps = z.infer<typeof getQuestionSummarySchema>
export type GetAnswersByUserAndFormProps = z.infer<typeof getAnswersByUserAndFormSchema>
export type GetAllAnswersByFormProps = z.infer<typeof getAllAnswersByFormSchema>
