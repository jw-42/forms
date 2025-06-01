import z from 'zod'

export const createFormSchema = z.object({
  title: z.string().min(10).max(64),
  description: z.string().min(10).max(256),
})

export const updateFormSchema = z.object({
  title: z.string().min(10).max(64).optional(),
  description: z.string().min(10).max(256).optional(),
}).refine(
  (data) => data.title !== undefined || data.description !== undefined,
  { message: "Either title or description must be provided" }
)

export const getFormsSchema = z.object({
  count: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
})

export type CreateFormInput = z.infer<typeof createFormSchema>
export type UpdateFormInput = z.infer<typeof updateFormSchema>
export type GetFormsInput = z.infer<typeof getFormsSchema>