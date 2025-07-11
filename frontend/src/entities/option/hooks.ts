import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const useOptions = (formId?: string, questionId?: string) => {
  return useQuery({
    queryKey: optionKeys.list(questionId as string),
    queryFn: () => getOptions(formId as string, questionId as string),
    enabled: !!questionId
  })
}

export const useOption = (formId?: string, questionId?: string, optionId?: string) => {
  return useQuery({
    queryKey: optionKeys.detail(questionId as string, optionId as string),
    queryFn: () => getOptionById(formId as string, questionId as string, optionId as string),
    enabled: !!questionId && !!optionId
  })
}

export const useUpdateOption = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { formId: string; questionId: string; optionId: string; data: UpdateOptionProps }) => 
      updateOption(data.formId, data.questionId, data.optionId, data.data),
    onSuccess: (_, { questionId, optionId }) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.list(questionId) })
      queryClient.invalidateQueries({ queryKey: optionKeys.detail(questionId, optionId) })
    }
  })
}

export const useDeleteOption = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { formId: string; questionId: string; optionId: string }) => 
      deleteOption(data.formId, data.questionId, data.optionId),
    onSuccess: (_, { questionId, optionId }) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.list(questionId) })
      queryClient.removeQueries({ queryKey: optionKeys.detail(questionId, optionId) })
    }
  })
}

export const useCreateMultipleOptions = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { formId: string; questionId: string; data: CreateMultipleOptionsProps }) => 
      createMultipleOptions(data.formId, data.questionId, data.data),
    onSuccess: (_, { formId, questionId }) => {
      queryClient.invalidateQueries({ queryKey: optionKeys.list(questionId) })
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) })
      queryClient.invalidateQueries({ queryKey: questionKeys.lists(formId) })
    }
  })
}
