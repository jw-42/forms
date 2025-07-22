import { FormIdType, AnswersGroupIdType, UserIdType, QuestionIdType, AnswerValueType, OptionIdType } from '@shared/model'
import { QuestionType } from '@entities/question'

export interface AnswerItemProps {
  question_id: number
  value: AnswerValueType
}

export interface AnswerItemResponse extends AnswerItemProps {
  question: {
    id: number
    text: string
    type: QuestionType
    options?: {
      id: number
      text: string
      order: number
    }[]
  }
}

export interface SubmitAnswersProps {
  formId: FormIdType
  data: {
    answers: AnswerItemProps[]
  }
}

export interface SubmitAnswersResponse {
  id: string
}

export interface GetAllAnswersProps {
  formId: FormIdType
}

export interface GetAllAnswersResponse {
  id: AnswersGroupIdType
  user_id: UserIdType
  created_at: string
}

export interface GetAnswersByUserIdProps {
  formId: FormIdType
  userId: UserIdType
}

export interface GetAnswersByUserIdResponse extends GetAllAnswersResponse {
  items: AnswerItemResponse[]
}

export interface ResetAnswersProps {
  formId: FormIdType
  userId: UserIdType
}

export interface ResetAnswersResponse {
  id: AnswersGroupIdType
}