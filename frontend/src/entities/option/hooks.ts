import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@shared/api/query-client"
import { 
  optionKeys, 
  getOptions, 
  getOptionById,
  updateOption, 
  deleteOption, 
  createMultipleOptions 
} from "./api"
import { UpdateOptionProps, CreateMultipleOptionsProps } from "./types"
import { questionKeys } from "@entities/question/hooks"

export const useOptions = (formId?: string, questionId?: number) => {
  return useQuery({
    queryKey: optionKeys.list(questionId as number),
    queryFn: () => getOptions(formId as string, questionId as number),
    enabled: !!questionId
  })
}

export const useOption = (formId?: string, questionId?: number, optionId?: number) => {
  return useQuery({
    queryKey: optionKeys.detail(questionId as number, optionId as number),
    queryFn: () => getOptionById(formId as string, questionId as number, optionId as number),
    enabled: !!questionId && !!optionId
  })
}

export const useUpdateOption = () => {
  // используем общий queryClient
  
  return useMutation({
    mutationFn: (data: { formId: string; questionId: number; optionId: number; data: UpdateOptionProps }) => 
      updateOption(data.formId, data.questionId, data.optionId, data.data),
    onSuccess: (_, { questionId, optionId }) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.list(questionId) })
      queryClient.invalidateQueries({ queryKey: optionKeys.detail(questionId, optionId) })
    }
  })
}

export const useDeleteOption = () => {
  // используем общий queryClient
  
  return useMutation({
    mutationFn: (data: { formId: string; questionId: number; optionId: number }) => 
      deleteOption(data.formId, data.questionId, data.optionId),
    onSuccess: (_, { questionId, optionId }) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.list(questionId) })
      queryClient.removeQueries({ queryKey: optionKeys.detail(questionId, optionId) })
    }
  })
}

export const useCreateMultipleOptions = () => {
  // используем общий queryClient
  
  return useMutation({
    mutationFn: (data: { formId: string; questionId: number; data: CreateMultipleOptionsProps }) => 
      createMultipleOptions(data.formId, data.questionId, data.data),
    onSuccess: (_, { formId, questionId }) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.list(questionId) })
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) })
      queryClient.invalidateQueries({ queryKey: questionKeys.lists(formId) })
    }
  })
}
