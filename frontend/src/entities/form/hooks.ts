import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@shared/api/query-client'
import { formKeys, getForms, getFormById, createForm, updateForm, deleteForm, generateFormDescription } from './api'
import { UpdateFormProps } from './types'
import { paymentKeys } from '@entities/payments/api'

export const useForms = () => {
  return useQuery({
    queryKey: formKeys.lists(),
    queryFn: getForms
  })
}

export const useForm = (id?: string) => {
  return useQuery({
    queryKey: formKeys.detail(id as string),
    queryFn: () => getFormById(id as string),
    enabled: !!id
  })
}

export const useCreateForm = () => {
  return useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    }
  })
}

export const useUpdateForm = () => {
  return useMutation({
    mutationFn: (data: { id: string; data: UpdateFormProps }) => 
      updateForm(data.id, data.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
      queryClient.invalidateQueries({ queryKey: formKeys.detail(id) })
    }
  })
}

export const useDeleteForm = () => {
  return useMutation({
    mutationFn: (id: string) => deleteForm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
      queryClient.removeQueries({ queryKey: formKeys.detail(id) })
    }
  })
}

export const useGenerateFormDescription = () => {
  return useMutation({
    mutationFn: (data: { formTitle: string }) => generateFormDescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.balance() })
    }
  })
} 