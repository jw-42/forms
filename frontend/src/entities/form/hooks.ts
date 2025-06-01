import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    }
  })
}

export const useUpdateForm = () => {
  const queryClient = useQueryClient()
  
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
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteForm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
      queryClient.removeQueries({ queryKey: formKeys.detail(id) })
    }
  })
} 