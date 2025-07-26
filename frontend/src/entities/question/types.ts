import { AnswerValueType, FormIdType, QuestionIdType } from "@shared/model"

export interface QuestionProps {
  id: QuestionIdType
  type: QuestionType
  form_id: FormIdType
  text: string
  disabled?: boolean
  options?: {
    id: number
    text: string
    order: number
  }[]
  value?: AnswerValueType
  onChange?: (value: string) => void
}

export type QuestionType = 'text' | 'long_text' | QuestionMultipleType
export type QuestionMultipleType = 'radio'

export const QuestionMultipleTypeDict: Record<QuestionMultipleType, string> = {
  radio: 'Выбор одного варианта',
} as const

export const QuestionTypeDict: Record<QuestionType, string> = {
  text: 'Текстовый вопрос',
  long_text: 'Развернутый вопрос',
  ...QuestionMultipleTypeDict
} as const

export interface QuestionItemProps {
  id: number
  form_id: string

  text: string
  type: QuestionType
  readOnly?: boolean

  value?: string
  onChange?: (value: string) => void

  options?: {
    id: number
    text: string
    order: number
  }[]
}

export interface TextQuestionProps {
  readOnly?: boolean
  value?: string
  onChange?: (value: string) => void
}