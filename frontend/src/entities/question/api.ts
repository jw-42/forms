import { QuestionProps } from './types'
import { apiClient } from '@shared/api'

export const questionApi = {    
  create: (formId: string, data: Omit<QuestionProps, 'id'|'form_id'>) =>
    apiClient.post<QuestionProps>(`/forms/${formId}/questions`, data),

  getAll: (formId: string) => 
    apiClient.get<QuestionProps[]>(`/forms/${formId}/questions`),

  getById: (formId: string, questionId: string) =>
    apiClient.get<QuestionProps>(`/forms/${formId}/questions/${questionId}`),
    
  update: (formId: string, questionId: string, data: Partial<QuestionProps>) =>
    apiClient.put<QuestionProps>(`/forms/${formId}/questions/${questionId}`, data),
    
  delete: (formId: string, questionId: string) =>
    apiClient.delete(`/forms/${formId}/questions/${questionId}`)
}
