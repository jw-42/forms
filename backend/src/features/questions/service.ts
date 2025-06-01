import type { CreateQuestionProps, UpdateQuestionProps } from './types'
import { 
  createQuestion as createQuestionRepo,
  getAllQuestions as getAllQuestionsRepo,
  getQuestionById as getQuestionByIdRepo,
  updateQuestion as updateQuestionRepo,
  deleteQuestion as deleteQuestionRepo
} from './repository'
import { ApiError } from '@shared/utils'
import getPrisma from '@infra/database/prisma'

const MAX_QUESTIONS_PER_FORM = 5

export async function createQuestion(data: CreateQuestionProps) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: data.form_id },
    include: { questions: true }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  if (form.questions.length >= MAX_QUESTIONS_PER_FORM) {
    throw ApiError.BadRequest('Maximum questions limit reached')
  }

  return createQuestionRepo(data)
}

export async function getAllQuestions(formId: string) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  return getAllQuestionsRepo(formId)
}

export async function getQuestionById(formId: string, questionId: string) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  const question = await getQuestionByIdRepo(formId, questionId)
  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  return question
}

export async function updateQuestion(formId: string, questionId: string, data: UpdateQuestionProps) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  const question = await getQuestionByIdRepo(formId, questionId)
  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  return updateQuestionRepo(formId, questionId, data)
}

export async function deleteQuestion(formId: string, questionId: string) {
  const prisma = getPrisma()
  
  const form = await prisma.form.findUnique({
    where: { id: formId }
  })

  if (!form) {
    throw ApiError.NotFound('Form not found')
  }

  const question = await getQuestionByIdRepo(formId, questionId)
  if (!question) {
    throw ApiError.NotFound('Question not found')
  }

  const result = await deleteQuestionRepo(formId, questionId)
  return result
}
