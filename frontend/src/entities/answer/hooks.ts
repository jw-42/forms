import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  answerKeys, 
  submit,
  getAll,
  getByUserId,
  reset,
} from './api'
import { formKeys } from '@entities/form/api'

// Hook for submitting answers
export const useSubmitAnswers = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: submit,
    onSuccess: (_data, variables) => {
      // Invalidate and refetch answers for the form
      queryClient.invalidateQueries({ queryKey: formKeys.detail(variables.formId) })
      queryClient.invalidateQueries({ queryKey: answerKeys.list(variables.formId) })
      queryClient.invalidateQueries({ queryKey: answerKeys.details() })
    },
  })
}

// Hook for getting all answers for a form
export const useGetAllAnswers = (formId: string) => {
  return useQuery({
    queryKey: answerKeys.list(formId),
    queryFn: () => getAll({ formId }),
    enabled: !!formId,
  })
}

// Hook for getting answers by user ID
export const useGetAnswersByUserId = (formId: string, userId: number | undefined) => {
  return useQuery({
    queryKey: answerKeys.detail(formId, userId?.toString() || ''),
    queryFn: () => getByUserId({ formId, userId: userId! }),
    enabled: !!formId && !!userId,
  })
}

// Hook for resetting answers
export const useResetAnswers = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: reset,
    onSuccess: (_data, variables) => {
      // Invalidate and refetch answers for the form
      queryClient.invalidateQueries({ queryKey: answerKeys.list(variables.formId) })
      queryClient.invalidateQueries({ queryKey: answerKeys.detail(variables.formId, variables.userId.toString()) })
      queryClient.invalidateQueries({ queryKey: formKeys.detail(variables.formId) })
    },
  })
}

