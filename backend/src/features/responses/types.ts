import { z } from 'zod'

export const submitAnswersSchema = z.object({
  answers: z.array(z.object({
    question_id: z.number(),
    value: z.string().max(1000)
  })).min(1)
})

export type SubmitAnswers = z.infer<typeof submitAnswersSchema> & {
  form_id: string
  user_id: number
  agreement_url: string
  agreement_hash: string
  ip_address?: string
  user_agent?: string
}