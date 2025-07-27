import z from 'zod'

export const MIN_FORM_TITLE_LENGTH = 10
export const MAX_FORM_TITLE_LENGTH = 64
export const MIN_FORM_DESCRIPTION_LENGTH = 10
export const MAX_FORM_DESCRIPTION_LENGTH = 256

export const createFormSchema = z.object({
  title: z.string()
    .min(MIN_FORM_TITLE_LENGTH)
    .max(MAX_FORM_TITLE_LENGTH),
  description: z.string()
    .min(MIN_FORM_DESCRIPTION_LENGTH)
    .max(MAX_FORM_DESCRIPTION_LENGTH),
  privacy_policy: z.url().optional(),
})

export const dataProcessingAgreementLogSchema = z.object({
  agreement_url: z.string(),
  agreement_hash: z.string(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
})

export const updateFormSchema = z.object({
  title: z.string()
    .min(MIN_FORM_TITLE_LENGTH)
    .max(MAX_FORM_TITLE_LENGTH)
    .optional(),
  description: z.string()
    .min(MIN_FORM_DESCRIPTION_LENGTH)
    .max(MAX_FORM_DESCRIPTION_LENGTH)
    .optional(),
}).refine(
  (data) => data.title !== undefined || data.description !== undefined,
  { message: 'Either title or description must be provided' }
)

export const getFormsSchema = z.object({
  count: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
})

export interface DataProcessingAgreementInput {
  agreement_url: string
  agreement_hash: string
  ip_address?: string | undefined
  user_agent?: string | undefined
}

export type CreateFormInput = z.infer<typeof createFormSchema>
export type UpdateFormInput = z.infer<typeof updateFormSchema>
export type GetFormsInput = z.infer<typeof getFormsSchema>