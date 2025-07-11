import type { CreateOptionProps, UpdateOptionProps, CreateMultipleOptionsProps } from './types'
import { 
  createOption as createOptionRepo,
  getAllOptions as getAllOptionsRepo,
  getOptionById as getOptionByIdRepo,
  updateOption as updateOptionRepo,
  deleteOption as deleteOptionRepo,
  createMultipleOptions as createMultipleOptionsRepo,
  getExistingOptions
} from './repository'
import { 
  getQuestionWithOptionsAndForm,
  getQuestionWithForm,
  getQuestion
} from '../questions/repository'
import { ApiError } from '@shared/utils'
import type { Prisma } from '@prisma/client'

const MAX_OPTIONS_PER_QUESTION = 4

export async function createOption(data: CreateOptionProps, userId: number) {
  const question = await getQuestionWithOptionsAndForm(data.question_id) as (Prisma.QuestionGetPayload<{ include: { options: true, form: { select: { owner_id: true } } } }> | null)

  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  if (!question.form || question.form.owner_id !== userId) {
    throw ApiError.Forbidden('Access denied')
  }

  if (question.type !== 'radio') {
    throw ApiError.BadRequest('Options can only be created for radio questions')
  }

  if (question.options.length >= MAX_OPTIONS_PER_QUESTION) {
    throw ApiError.BadRequest('Maximum options limit reached')
  }

  return createOptionRepo(data)
}

export async function getAllOptions(questionId: string) {
  const question = await getQuestion(questionId)

  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  return getAllOptionsRepo(questionId)
}

export async function getOptionById(questionId: string, optionId: string) {
  const question = await getQuestion(questionId)

  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  const option = await getOptionByIdRepo(questionId, optionId)
  if (!option) {
    throw ApiError.NotFound('Option not found')
  }

  return option
}

export async function updateOption(questionId: string, optionId: string, data: UpdateOptionProps, userId: number) {
  const question = await getQuestionWithForm(questionId) as (Prisma.QuestionGetPayload<{ include: { form: { select: { owner_id: true } } } }> | null)

  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  if (!question.form || question.form.owner_id !== userId) {
    throw ApiError.Forbidden('Access denied')
  }

  const option = await getOptionByIdRepo(questionId, optionId)
  if (!option) {
    throw ApiError.NotFound('Option not found')
  }

  return updateOptionRepo(questionId, optionId, data)
}

export async function deleteOption(questionId: string, optionId: string, userId: number) {
  const question = await getQuestionWithForm(questionId) as (Prisma.QuestionGetPayload<{ include: { form: { select: { owner_id: true } } } }> | null)

  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  if (!question.form || question.form.owner_id !== userId) {
    throw ApiError.Forbidden('Access denied')
  }

  const option = await getOptionByIdRepo(questionId, optionId)
  if (!option) {
    throw ApiError.NotFound('Option not found')
  }

  return deleteOptionRepo(questionId, optionId)
}

export async function createMultipleOptions(data: CreateMultipleOptionsProps, userId: number) {
  const question = await getQuestionWithOptionsAndForm(data.question_id) as (Prisma.QuestionGetPayload<{ include: { options: true, form: { select: { owner_id: true } } } }> | null)

  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  if (!question.form || question.form.owner_id !== userId) {
    throw ApiError.Forbidden('Access denied')
  }

  if (question.type !== 'radio') {
    throw ApiError.BadRequest('Options can only be created for radio questions')
  }

  if (data.options.length > MAX_OPTIONS_PER_QUESTION) {
    throw ApiError.BadRequest('Maximum options limit exceeded')
  }

  // Проверяем, что все существующие опции принадлежат указанному вопросу
  const existingOptionIds = data.options.filter(option => option.id).map(option => option.id!)
  if (existingOptionIds.length > 0) {
    const existingOptions = await getExistingOptions(existingOptionIds, data.question_id)
    
    if (existingOptions.length !== existingOptionIds.length) {
      throw ApiError.BadRequest('Some options do not belong to the specified question')
    }
  }

  // Фильтруем дублирующие опции по тексту, отдавая предпочтение опциям с id
  const uniqueOptions = data.options.filter((option, index, self) => {
    const firstIndex = self.findIndex(o => o.text.toLowerCase().trim() === option.text.toLowerCase().trim())
    if (firstIndex === index) return true
    
    // Если это дубликат, проверяем, есть ли у текущей опции id, а у первой - нет
    const firstOption = self[firstIndex]
    return option.id && !firstOption?.id
  })

  // Проверяем лимит после фильтрации
  if (uniqueOptions.length > MAX_OPTIONS_PER_QUESTION) {
    throw ApiError.BadRequest('Maximum options limit exceeded after removing duplicates')
  }

  return createMultipleOptionsRepo({ ...data, options: uniqueOptions })
}
