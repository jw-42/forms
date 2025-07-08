import type { SubmitAnswersProps } from './types'
import { 
  submitAnswers as submitAnswersRepo,
  getAnswersGroupById as getAnswersGroupByIdRepo,
  deleteAnswersGroup as deleteAnswersGroupRepo,
  deleteAnswersByUserAndForm as deleteAnswersByUserAndFormRepo,
  getAnswersGroupsByUserAndForm as getAnswersGroupsByUserAndFormRepo,
  getAnswersGroupsByForm as getAnswersGroupsByFormRepo,
  getFormWithQuestions,
  getFormById,
  findExistingAnswer
} from './repository'
import { ApiError } from '@shared/utils'

export async function submitAnswers(data: SubmitAnswersProps) {
  // Check if form exists
  const form = await getFormWithQuestions(data.form_id)

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Check if user already answered this form
  const existingAnswer = await findExistingAnswer(data.form_id, data.user_id)

  if (existingAnswer) {
    throw ApiError.BadRequest('User already answered this form')
  }

  // Validate that all questions exist and are answered
  const questionIds = form.questions.map(q => q.id)
  const answeredQuestionIds = data.answers.map(a => a.question_id)
  
  const missingQuestions = questionIds.filter(id => !answeredQuestionIds.includes(id))
  if (missingQuestions.length > 0) {
    throw ApiError.BadRequest('All questions must be answered')
  }

  const extraQuestions = answeredQuestionIds.filter(id => !questionIds.includes(id))
  if (extraQuestions.length > 0) {
    throw ApiError.BadRequest('Invalid question IDs provided')
  }

  return submitAnswersRepo(data)
}

export async function deleteAnswersGroup(userId: number, currentUserId: number, formId: string) {
  // Check if form exists
  const form = await getFormById(formId)
  
  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Check permissions: user can delete their own answers or form owner can delete any answers
  const canDelete = userId === currentUserId || form.owner_id === currentUserId
  
  if (!canDelete) {
    throw ApiError.Forbidden('Insufficient permissions to delete these answers')
  }

  return deleteAnswersByUserAndFormRepo(userId, formId)
}

export async function getAnswersByUserAndForm(formId: string, userId: number, currentUserId: number) {
  // Check if form exists
  const form = await getFormById(formId)

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Check permissions: user can view their own answers or form owner can view any answers
  const canView = userId === currentUserId || form.owner_id === currentUserId
  
  if (!canView) {
    throw ApiError.Forbidden('Insufficient permissions to view these answers')
  }

  return getAnswersGroupsByUserAndFormRepo(userId, formId)
}

export async function getAllAnswersByForm(formId: string, currentUserId: number) {
  // Check if form exists
  const form = await getFormById(formId)

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Check permissions: only form owner can view all answers
  if (form.owner_id !== currentUserId) {
    throw ApiError.Forbidden('Insufficient permissions to view all answers')
  }

  return getAnswersGroupsByFormRepo(formId)
}