export interface QuestionProps {
  id: string
  type: 'text'
  form_id: string
  text: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}

export type QuestionType = 'text'

export const PARSE_TYPE: Record<QuestionType, string> = {
  text: 'Текстовый вопрос'
} as const

export interface QuestionItemProps {
  id: string
  form_id: string

  text: string
  type: QuestionType
  readOnly?: boolean

  value?: string
  onChange?: (value: string) => void
}