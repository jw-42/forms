import { apiClient } from "@shared/api"
import { OptionProps, UpdateOptionProps, CreateMultipleOptionsProps } from "./types"

export const optionKeys = {
  all: ["options"] as const,
  lists: () => [...optionKeys.all, "list"] as const,
  list: (questionId: string) => [...optionKeys.lists(), questionId] as const,
  details: () => [...optionKeys.all, "detail"] as const,
  detail: (questionId: string, optionId: string) => [...optionKeys.details(), questionId, optionId] as const,
}

export const createMultipleOptions = async (formId: string, questionId: string, data: CreateMultipleOptionsProps): Promise<OptionProps[]> => {
  return await apiClient.post(`/forms/${formId}/questions/${questionId}/options`, data)
}

export const getOptions = async (formId: string, questionId: string): Promise<OptionProps[]> => {
  return await apiClient.get(`/forms/${formId}/questions/${questionId}/options`)
}

export const getOptionById = async (formId: string, questionId: string, optionId: string): Promise<OptionProps> => {
  return await apiClient.get(`/forms/${formId}/questions/${questionId}/options/${optionId}`)
}

export const updateOption = async (formId: string, questionId: string, optionId: string, data: UpdateOptionProps): Promise<OptionProps> => {
  return await apiClient.put(`/forms/${formId}/questions/${questionId}/options/${optionId}`, data)
}

export const deleteOption = async (formId: string, questionId: string, optionId: string): Promise<{ id: string }> => {
  return await apiClient.delete(`/forms/${formId}/questions/${questionId}/options/${optionId}`)
}