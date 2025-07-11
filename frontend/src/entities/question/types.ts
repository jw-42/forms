import { AnswerValueType, FormIdType, QuestionIdType } from "@shared/model"

export interface QuestionProps {
  id: QuestionIdType
  type: QuestionType
  form_id: FormIdType
  text: string
  disabled?: boolean
  options?: {
    id: string
    text: string
    order: number
  }[]
  value?: AnswerValueType
  onChange?: (value: string) => void
}

export type QuestionType = 'text' | QuestionMultipleType
export type QuestionMultipleType = 'radio'

export const QuestionMultipleTypeDict: Record<QuestionMultipleType, string> = {
  radio: 'Выбор одного варианта',
} as const

export const QuestionTypeDict: Record<QuestionType, string> = {
  text: 'Текстовый вопрос',
  ...QuestionMultipleTypeDict
} as const

export interface QuestionItemProps {
  id: string
  form_id: string

  text: string
  type: QuestionType
  readOnly?: boolean

  value?: string
  onChange?: (value: string) => void

  options?: {
    id: string
    text: string
    order: number
  }[]
}