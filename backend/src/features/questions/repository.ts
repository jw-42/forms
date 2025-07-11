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
    include: {
      options: {
        select: {
          id: true,
          text: true,
          order: true
        }
      }
    },
    orderBy: { created_at: 'asc' }
  })
}

export async function getQuestionById(formId: string, questionId: string) {
  const prisma = getPrisma()
  return prisma.question.findFirst({
    where: { 
      id: questionId,
      form_id: formId
    },
    include: {
      options: {
        select: {
          id: true,
          text: true,
          order: true
        }
      }
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

// Универсальная функция для получения вопроса с настраиваемыми включениями
export async function getQuestionWithInclude(questionId: string, include?: any) {
  const prisma = getPrisma()
  return prisma.question.findUnique({
    where: { id: questionId },
    include
  })
}

// Функции для получения вопросов с различными включениями
export async function getQuestionWithOptionsAndForm(questionId: string) {
  return getQuestionWithInclude(questionId, { 
    options: true,
    form: {
      select: { owner_id: true }
    }
  })
}

export async function getQuestionWithForm(questionId: string) {
  return getQuestionWithInclude(questionId, {
    form: {
      select: { owner_id: true }
    }
  })
}

export async function getQuestion(questionId: string) {
  return getQuestionWithInclude(questionId)
}
