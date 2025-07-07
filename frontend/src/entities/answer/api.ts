import { apiClient } from '@shared/api'
import {
  SubmitAnswersProps,
  SubmitAnswersResponse,
  GetAllAnswersProps,
  GetAllAnswersResponse,
  GetAnswersByUserIdProps,
  GetAnswersByUserIdResponse,
  ResetAnswersProps,
  ResetAnswersResponse,
} from './types'

export const answerKeys = {
  all: ['answers'] as const,
  lists: () => [...answerKeys.all, 'list'] as const,
  list: (formId: string) => [...answerKeys.lists(), formId] as const,
  details: () => [...answerKeys.all, 'detail'] as const,
  detail: (formId: string, answerGroupId: string) => [...answerKeys.details(), formId, answerGroupId] as const
}

export const submit = async ({ formId, data }: SubmitAnswersProps): Promise<SubmitAnswersResponse> => {
  return await apiClient.post(`/forms/${formId}/answers`, data)
}

export const getAll = async ({ formId }: GetAllAnswersProps): Promise<GetAllAnswersResponse[]> => {
  return await apiClient.get(`/forms/${formId}/answers`)
}

export const getByUserId = async ({ formId, userId }: GetAnswersByUserIdProps): Promise<GetAnswersByUserIdResponse> => {
  if (!userId) throw new Error('User ID is required')
  return await apiClient.get(`/forms/${formId}/answers/${userId}`)
}

export const reset = async ({ formId, answerGroupId }: ResetAnswersProps): Promise<ResetAnswersResponse> => {
  return await apiClient.delete(`/forms/${formId}/answers/${answerGroupId}`)
}