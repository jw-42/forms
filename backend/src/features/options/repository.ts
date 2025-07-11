import type { CreateOptionProps, UpdateOptionProps, CreateMultipleOptionsProps } from './types'
import getPrisma from '@infra/database/prisma'
import { 
  getQuestionWithOptionsAndForm,
  getQuestionWithForm,
  getQuestion
} from '../questions/repository'

export async function createOption(data: CreateOptionProps) {
  const prisma = getPrisma()
  return prisma.option.create({
    data: {
      question_id: data.question_id,
      text: data.text,
      order: data.order || 0,
    },
  })
}

export async function getAllOptions(questionId: string) {
  const prisma = getPrisma()
  return prisma.option.findMany({
    where: { question_id: questionId },
    orderBy: { order: 'asc' }
  })
}

export async function getOptionById(questionId: string, optionId: string) {
  const prisma = getPrisma()
  return prisma.option.findFirst({
    where: { 
      id: optionId,
      question_id: questionId
    }
  })
}

export async function updateOption(questionId: string, optionId: string, data: UpdateOptionProps) {
  const prisma = getPrisma()
  return prisma.option.update({
    where: { 
      id: optionId,
      question_id: questionId
    },
    data: {
      text: data.text,
      order: data.order
    }
  })
}

export async function deleteOption(questionId: string, optionId: string) {
  const prisma = getPrisma()
  return prisma.option.delete({
    where: { 
      id: optionId,
      question_id: questionId
    },
    select: {
      id: true
    }
  })
}

export async function createMultipleOptions(data: CreateMultipleOptionsProps) {
  const prisma = getPrisma()
  
  // Получаем ID всех переданных опций
  const passedOptionIds = data.options.filter(option => option.id).map(option => option.id!)
  
  // Удаляем опции, которые не были переданы
  const deleteOperations = passedOptionIds.length > 0 
    ? [prisma.option.deleteMany({
        where: {
          question_id: data.question_id,
          id: { notIn: passedOptionIds }
        }
      })]
    : [prisma.option.deleteMany({
        where: { question_id: data.question_id }
      })]
  
  // Операции для создания/обновления опций
  const upsertOperations = data.options.map((option, index) => {
    if (option.id) {
      // Обновляем существующую опцию
      return prisma.option.update({
        where: { 
          id: option.id,
          question_id: data.question_id
        },
        data: {
          text: option.text,
          order: option.order ?? index
        }
      })
    } else {
      // Создаем новую опцию
      return prisma.option.create({
        data: {
          question_id: data.question_id,
          text: option.text,
          order: option.order ?? index
        }
      })
    }
  })

  const result = await prisma.$transaction([...deleteOperations, ...upsertOperations])
  
  // Возвращаем только опции (пропускаем результаты операций удаления)
  return result.slice(deleteOperations.length)
}

export async function getExistingOptions(optionIds: string[], questionId: string) {
  const prisma = getPrisma()
  return prisma.option.findMany({
    where: {
      id: { in: optionIds },
      question_id: questionId
    }
  })
}
