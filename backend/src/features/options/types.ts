import { z } from 'zod'

export const createOptionSchema = z.object({
  text: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
})

export const updateOptionSchema = z.object({
  text: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
})

export const createMultipleOptionsSchema = z.object({
  options: z.array(z.object({
    id: z.string().optional(), // для существующих опций
    text: z.string().min(1).max(100),
    order: z.number().int().min(0).optional(),
  })).min(2).max(4),
})

export type CreateOptionProps = z.infer<typeof createOptionSchema> & { question_id: string }
export type UpdateOptionProps = z.infer<typeof updateOptionSchema>
export type CreateMultipleOptionsProps = z.infer<typeof createMultipleOptionsSchema> & { question_id: string }
