import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@shared/api/query-client'
import { formKeys, getForms, getFormById, createForm, updateForm, deleteForm } from './api'
import { UpdateFormProps } from './types'

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
  // используем общий queryClient
  
  return useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    }
  })
}

export const useUpdateForm = () => {
  // используем общий queryClient
  
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
  // используем общий queryClient
  
  return useMutation({
    mutationFn: (id: string) => deleteForm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
      queryClient.removeQueries({ queryKey: formKeys.detail(id) })
    }
  })
} 