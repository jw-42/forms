import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  answerKeys, 
  submitAnswers, 
  getAnswersByForm, 
  getAnswersGroupById, 
  deleteAnswersGroup,
  getAnswersSummary,
  getQuestionSummary
} from './api'
import { SubmitAnswersProps } from './types'

export const useAnswersByForm = (formId?: string) => {
  return useQuery({
    queryKey: answerKeys.list(formId as string),
    queryFn: () => getAnswersByForm(formId as string),
    enabled: !!formId
  })
}

export const useAnswersGroup = (formId?: string, answersGroupId?: string) => {
  return useQuery({
    queryKey: answerKeys.detail(formId as string, answersGroupId as string),
    queryFn: () => getAnswersGroupById(formId as string, answersGroupId as string),
    enabled: !!formId && !!answersGroupId
  })
}

export const useAnswersSummary = (formId?: string) => {
  return useQuery({
    queryKey: answerKeys.summary(formId as string),
    queryFn: () => getAnswersSummary(formId as string),
    enabled: !!formId
  })
}

export const useQuestionSummary = (formId?: string, questionId?: string) => {
  return useQuery({
    queryKey: answerKeys.questionSummary(formId as string, questionId as string),
    queryFn: () => getQuestionSummary(formId as string, questionId as string),
    enabled: !!formId && !!questionId
  })
}

export const useSubmitAnswers = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { formId: string; data: SubmitAnswersProps }) => 
      submitAnswers(data.formId, data.data),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({ queryKey: answerKeys.list(formId) })
      queryClient.invalidateQueries({ queryKey: answerKeys.summary(formId) })
    }
  })
}

export const useDeleteAnswersGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { formId: string; answersGroupId: string }) => 
      deleteAnswersGroup(data.formId, data.answersGroupId),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({ queryKey: answerKeys.list(formId) })
      queryClient.invalidateQueries({ queryKey: answerKeys.summary(formId) })
    }
  })
} 