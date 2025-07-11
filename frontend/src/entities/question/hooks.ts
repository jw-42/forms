import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { questionApi } from './api'
import { QuestionProps } from './types'

export const questionKeys = {
  lists: (form_id: string) => ['questions', form_id] as const,
  detail: (questionId: string) => ['questions', questionId] as const
}

/**
 * Хук для получения списка вопросов
 */
export const useQuestions = (formId?: string) => {
  return useQuery({
    queryKey: questionKeys.lists(formId as string),
    queryFn: () => questionApi.getAll(formId as string),
    enabled: !!formId
  })
}

/**
 * Хук для получения вопроса
 */
export const useQuestion = (formId?: string, questionId?: string) => {
  return useQuery({
    queryKey: questionKeys.detail(questionId as string),
    queryFn: () => questionApi.getById(formId as string, questionId as string),
    enabled: !!(formId && questionId)
  })
}

/**
 * Хук для создания вопроса
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ formId, data }: { formId: string, data: Omit<QuestionProps, 'id'|'form_id'> }) => 
      questionApi.create(formId, data),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists(formId) })
    }
  })
}

/**
 * Хук для обновления вопроса
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ formId, questionId, data }: { formId: string, questionId: string, data: Partial<QuestionProps> }) => 
      questionApi.update(formId, questionId, data),
    onSuccess: (_, { formId, questionId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists(formId) })
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) })
    }
  })
}

/**
 * Хук для удаления вопроса
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ formId, questionId }: { formId: string, questionId: string }) => 
      questionApi.delete(formId, questionId),
    onSuccess: (_, { formId, questionId }) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists(formId) })
      queryClient.removeQueries({ queryKey: questionKeys.detail(questionId) })
    }
  })
} 