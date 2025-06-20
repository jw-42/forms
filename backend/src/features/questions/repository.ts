import type { CreateQuestionProps, UpdateQuestionProps } from './types'
import getPrisma from '@infra/database/prisma'

export async function createQuestion(data: CreateQuestionProps) {
  const prisma = getPrisma()
  return prisma.question.create({
    data: {
      type: data.type,
      form_id: data.form_id,
      text: data.text,
    },
  })
}

export async function getAllQuestions(formId: string) {
  const prisma = getPrisma()
  return prisma.question.findMany({
    where: { form_id: formId },
    orderBy: { created_at: 'asc' }
  })
}

export async function getQuestionById(formId: string, questionId: string) {
  const prisma = getPrisma()
  return prisma.question.findFirst({
    where: { 
      id: questionId,
      form_id: formId
    }
  })
}

export async function updateQuestion(formId: string, questionId: string, data: UpdateQuestionProps) {
  const prisma = getPrisma()
  return prisma.question.update({
    where: { 
      id: questionId,
      form_id: formId
    },
    data: {
      text: data.text
    }
  })
}

export async function deleteQuestion(formId: string, questionId: string) {
  const prisma = getPrisma()
  return prisma.question.delete({
    where: { 
      id: questionId,
      form_id: formId
    },
    select: {
      id: true
    }
  })
}
