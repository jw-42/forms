import { apiClient } from '@shared/api'
import { 
  SubmitAnswersProps, 
  AnswersGroupProps, 
  AnswersSummaryProps, 
  QuestionSummaryProps,
  MyAnswerProps
} from './types'

export const answerKeys = {
  all: ['answers'] as const,
  lists: () => [...answerKeys.all, 'list'] as const,
  list: (formId: string) => [...answerKeys.lists(), formId] as const,
  details: () => [...answerKeys.all, 'detail'] as const,
  detail: (formId: string, answersGroupId: string) => [...answerKeys.details(), formId, answersGroupId] as const,
  summary: (formId: string) => [...answerKeys.all, 'summary', formId] as const,
  questionSummary: (formId: string, questionId: string) => [...answerKeys.all, 'questionSummary', formId, questionId] as const,
  myAnswers: () => [...answerKeys.all, 'my'] as const,
}

export const submitAnswers = async (formId: string, data: SubmitAnswersProps): Promise<{ id: string }> => {
  return await apiClient.post(`/forms/${formId}/answers`, data)
}

export const getAnswersByForm = async (formId: string): Promise<AnswersGroupProps[]> => {
  return await apiClient.get(`/forms/${formId}/answers`)
}

export const getAnswersGroupById = async (formId: string, answersGroupId: string): Promise<AnswersGroupProps> => {
  return await apiClient.get(`/forms/${formId}/answers/${answersGroupId}`)
}

export const deleteAnswersGroup = async (formId: string, answersGroupId: string): Promise<{ id: string }> => {
  return await apiClient.delete(`/forms/${formId}/answers/${answersGroupId}`)
}

export const getAnswersSummary = async (formId: string): Promise<AnswersSummaryProps> => {
  return await apiClient.get(`/forms/${formId}/answers/summary`)
}

export const getQuestionSummary = async (formId: string, questionId: string): Promise<QuestionSummaryProps> => {
  return await apiClient.get(`/forms/${formId}/answers/summary/${questionId}`)
}

export const getMyAnswers = async (): Promise<MyAnswerProps[]> => {
  return await apiClient.get('/answers')
} 