import { FormIdType, AnswersGroupIdType, UserIdType, QuestionIdType, AnswerValueType } from '@shared/model'
import { QuestionType } from '@entities/question'

export interface AnswerItemProps {
  question_id: QuestionIdType
  value: AnswerValueType
}

export interface AnswerItemResponse extends AnswerItemProps {
  question: {
    id: string
    text: string
    type: QuestionType
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
  answerGroupId: AnswersGroupIdType
}

export interface ResetAnswersResponse {
  id: AnswersGroupIdType
}