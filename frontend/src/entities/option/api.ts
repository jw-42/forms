import { apiClient } from "@shared/api"
import { OptionProps, UpdateOptionProps, CreateMultipleOptionsProps } from "./types"

export const optionKeys = {
  all: ["options"] as const,
  lists: () => [...optionKeys.all, "list"] as const,
  list: (questionId: number) => [...optionKeys.lists(), questionId] as const,
  details: () => [...optionKeys.all, "detail"] as const,
  detail: (questionId: number, optionId: number) => [...optionKeys.details(), questionId, optionId] as const,
}

export const createMultipleOptions = async (formId: string, questionId: number, data: CreateMultipleOptionsProps): Promise<OptionProps[]> => {
  return await apiClient.post(`/forms/${formId}/questions/${questionId}/options`, data)
}

export const getOptions = async (formId: string, questionId: number): Promise<OptionProps[]> => {
  return await apiClient.get(`/forms/${formId}/questions/${questionId}/options`)
}

export const getOptionById = async (formId: string, questionId: number, optionId: number): Promise<OptionProps> => {
  return await apiClient.get(`/forms/${formId}/questions/${questionId}/options/${optionId}`)
}

export const updateOption = async (formId: string, questionId: number, optionId: number, data: UpdateOptionProps): Promise<OptionProps> => {
  return await apiClient.put(`/forms/${formId}/questions/${questionId}/options/${optionId}`, data)
}

export const deleteOption = async (formId: string, questionId: number, optionId: number): Promise<{ id: number }> => {
  return await apiClient.delete(`/forms/${formId}/questions/${questionId}/options/${optionId}`)
}