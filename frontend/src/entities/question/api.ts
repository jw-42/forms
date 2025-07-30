import { QuestionProps } from './types'
import { apiClient } from '@shared/api'

export const questionApi = {    
  create: (formId: string, data: Omit<QuestionProps, 'id'|'form_id'>) =>
    apiClient.post<QuestionProps>(`/forms/${formId}/questions`, data),

  getAll: (formId: string) => 
    apiClient.get<QuestionProps[]>(`/forms/${formId}/questions`),

  getById: (formId: string, questionId: number) =>
    apiClient.get<QuestionProps>(`/forms/${formId}/questions/${questionId}`),
    
  update: (formId: string, questionId: number, data: Partial<QuestionProps>) =>
    apiClient.put<QuestionProps>(`/forms/${formId}/questions/${questionId}`, data),
    
  delete: (formId: string, questionId: number) =>
    apiClient.delete(`/forms/${formId}/questions/${questionId}`),

  generateDescription: (formId: string, questionId: number, data: { questionText: string, questionType: string }) =>
    apiClient.post<{ description: string, generated: boolean }>(`/forms/${formId}/questions/${questionId}/generate-description`, data)
}
