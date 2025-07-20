import { z } from 'zod'

export const createOptionsSchema = z.object({
  options: z.array(z.object({
    id: z.number().optional(), // для существующих опций
    text: z.string().min(1).max(100),
    order: z.number().int().min(0).optional(),
  })).min(2).max(4),
})

export const updateOptionSchema = z.object({
  text: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
})

export type CreateOptionsProps = z.infer<typeof createOptionsSchema> & { question_id: number }
export type UpdateOptionProps = z.infer<typeof updateOptionSchema>