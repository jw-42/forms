import type { SubmitAnswersProps } from './types'
import { 
  submitAnswers as submitAnswersRepo,
  getAnswersGroupsByForm as getAnswersGroupsByFormRepo,
  getAnswersGroupsByUser as getAnswersGroupsByUserRepo,
  getAnswersGroupById as getAnswersGroupByIdRepo,
  getAnswersGroupByIdWithAnswers as getAnswersGroupByIdWithAnswersRepo,
  deleteAnswersGroup as deleteAnswersGroupRepo,
  getAnswersSummary as getAnswersSummaryRepo,
  getQuestionSummary as getQuestionSummaryRepo
} from './repository'
import { ApiError } from '@shared/utils'
import getPrisma from '@infra/database/prisma'

export async function submitAnswers(data: SubmitAnswersProps) {
  const prisma = getPrisma()
  
  // Check if form exists
  const form = await prisma.form.findUnique({
    where: { id: data.form_id },
    include: { questions: true }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Check if user already answered this form
  const existingAnswer = await prisma.answersGroup.findFirst({
    where: {
      form_id: data.form_id,
      user_id: data.user_id
    }
  })

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

export async function getAnswersGroupsByForm(formId: string, userId: string) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Only form owner can see answers
  if (form.owner_id !== userId) {
    throw ApiError.Forbidden('Only form owner can view answers')
  }

  return getAnswersGroupsByFormRepo(formId)
}

export async function getAnswersGroupsByUser(userId: string) {
  return getAnswersGroupsByUserRepo(userId)
}

export async function getAnswersGroupById(answersGroupId: string, userId: string, formId: string) {
  const answersGroup = await getAnswersGroupByIdWithAnswersRepo(answersGroupId)
  
  if (!answersGroup) {
    throw ApiError.NotFound('Answers group not found')
  }

  // Check that answers group belongs to the specified form
  if (answersGroup.form_id !== formId) {
    throw ApiError.NotFound('Answers group not found for this form')
  }

  // Get form info to check ownership
  const prisma = getPrisma()
  const form = await prisma.form.findUnique({
    where: { id: answersGroup.form_id },
    select: { owner_id: true }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Check permissions: user can view their own answers or form owner can view any answers
  const canView = answersGroup.user_id === userId || form.owner_id === userId
  
  if (!canView) {
    throw ApiError.Forbidden('Insufficient permissions to view this answers group')
  }

  return answersGroup
}

export async function deleteAnswersGroup(answersGroupId: string, userId: string, formId: string) {
  const answersGroup = await getAnswersGroupByIdRepo(answersGroupId)
  
  if (!answersGroup) {
    throw ApiError.NotFound('Answers group not found')
  }

  // Check that answers group belongs to the specified form
  if (answersGroup.form_id !== formId) {
    throw ApiError.NotFound('Answers group not found for this form')
  }

  // Check permissions: user can delete their own answers or form owner can delete any answers
  const canDelete = answersGroup.user.id === userId || answersGroup.form.owner_id === userId
  
  if (!canDelete) {
    throw ApiError.Forbidden('Insufficient permissions to delete this answers group')
  }

  return deleteAnswersGroupRepo(answersGroupId)
}

export async function getAnswersSummary(formId: string, userId: string) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Only form owner can see answers summary
  if (form.owner_id !== userId) {
    throw ApiError.Forbidden('Only form owner can view answers summary')
  }

  return getAnswersSummaryRepo(formId)
}

export async function getQuestionSummary(formId: string, questionId: string, userId: string) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  // Only form owner can see question summary
  if (form.owner_id !== userId) {
    throw ApiError.Forbidden('Only form owner can view question summary')
  }

  const summary = await getQuestionSummaryRepo(formId, questionId)
  
  if (!summary) {
    throw ApiError.NotFound('Question not found')
  }

  return summary
}
