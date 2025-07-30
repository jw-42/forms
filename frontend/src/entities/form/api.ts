import { apiClient } from '@shared/api'
import { CreateFormProps, FormBaseProps, FormDetailProps, UpdateFormProps } from './types'

export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  list: (filters: string) => [...formKeys.lists(), { filters }] as const,
  details: () => [...formKeys.all, 'detail'] as const,
  detail: (id: string) => [...formKeys.details(), id] as const,
}

export const getForms = async (): Promise<FormBaseProps[]> => {
  return await apiClient.get('/forms')
}

export const getFormById = async (id: string): Promise<FormDetailProps> => {
  return await apiClient.get(`/forms/${id}`)
}

export const createForm = async (data: CreateFormProps): Promise<{ id: string }> => {
  return await apiClient.post('/forms', data)
}

export const updateForm = async (id: string, data: UpdateFormProps): Promise<FormDetailProps> => {
  return await apiClient.put(`/forms/${id}`, data)
}

export const deleteForm = async (id: string): Promise<{ id: string }> => {
  return await apiClient.delete(`/forms/${id}`)
}

export const generateFormDescription = async (data: { formTitle: string }): Promise<{ description: string, generated: boolean }> => {
  return await apiClient.post(`/forms/generate-description`, { form_title: data.formTitle })
}