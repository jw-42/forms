import { AnswerValueType, FormIdType, QuestionIdType } from "@shared/model"

export interface QuestionProps {
  id: QuestionIdType
  type: QuestionType
  form_id: FormIdType
  text: string
  disabled?: boolean
  value?: AnswerValueType
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