export interface AnswerProps {
  question_id: string
  value: string
}

export interface AnswersGroupProps {
  id: string
  form_id: string
  user_id: string
  created_at: string
  items: AnswersGroupItemProps[]
}

export interface AnswersGroupItemProps {
  id: string
  value: string
  question: {
    id: string
    text: string
    type: string
  }
}

export interface SubmitAnswersProps {
  answers: AnswerProps[]
}

export interface AnswersSummaryProps {
  total_answers: number
  question_summaries: Array<{
    question_id: string
    question_text: string
    answer_count: number
    unique_answers: Array<{
      value: string
      count: number
    }>
  }>
}

export interface QuestionSummaryProps {
  question_id: string
  question_text: string
  answer_count: number
  unique_answers: Array<{
    value: string
    count: number
  }>
} 