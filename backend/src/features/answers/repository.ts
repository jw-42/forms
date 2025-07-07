import type { SubmitAnswersProps } from './types'
import getPrisma from '@infra/database/prisma'

export async function submitAnswers(data: SubmitAnswersProps) {
  const prisma = getPrisma()
  
  return prisma.$transaction(async (tx) => {
    // Create answers group
    const { id: answers_group_id } = await tx.answersGroup.create({
      data: {
        form_id: data.form_id,
        user_id: data.user_id,
      },
      select: {
        id: true
      }
    })

    // Create answers
    const answers = await tx.answer.createMany({
      data: data.answers.map(answer => ({
        answers_group_id,
        question_id: answer.question_id,
        value: answer.value,
      }))
    })

    return { id: answers_group_id }
  })
}

export async function getAnswersGroupsByForm(formId: string) {
  const prisma = getPrisma()
  return prisma.answersGroup.findMany({
    where: { form_id: formId },
    select: {
      id: true,
      user_id: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' }
  })
}

export async function getAnswersGroupsByUser(userId: number) {
  const prisma = getPrisma()
  return prisma.answersGroup.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      created_at: true,
      form: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: { created_at: 'desc' }
  })
}

export async function getAnswersGroupsByUserAndForm(userId: number, formId: string) {
  const prisma = getPrisma()
  return prisma.answersGroup.findUnique({
    where: { unique_key: { form_id: formId, user_id: userId } },
    select: {
      id: true,
      user_id: true,
      created_at: true,
      items: {
        select: {
          question_id: true,
          value: true,
          question: {
            select: {
              id: true,
              text: true,
              type: true
            }
          }
        }
      }
    }
  })
}

export async function getAnswersGroupById(answersGroupId: string) {
  const prisma = getPrisma()
  return prisma.answersGroup.findUnique({
    where: { id: answersGroupId },
    include: {
      form: {
        select: {
          id: true,
          owner_id: true
        }
      },
      user: {
        select: {
          id: true
        }
      }
    }
  })
}

export async function getAnswersGroupByIdWithAnswers(answersGroupId: string) {
  const prisma = getPrisma()
  return prisma.answersGroup.findUnique({
    where: { id: answersGroupId },
    select: {
      id: true,
      user_id: true,
      form_id: true,
      created_at: true,
      items: {
        select: {
          id: true,
          value: true,
          question: {
            select: {
              id: true,
              text: true,
              type: true
            }
          }
        }
      }
    }
  })
}

export async function deleteAnswersGroup(answersGroupId: string) {
  const prisma = getPrisma()
  return prisma.answersGroup.delete({
    where: { id: answersGroupId },
    select: { id: true }
  })
}

export async function hasUserAnsweredForm(formId: string, userId: number) {
  const prisma = getPrisma()
  const answersGroup = await prisma.answersGroup.findFirst({
    where: {
      form_id: formId,
      user_id: userId
    },
    select: { id: true }
  })
  
  return !!answersGroup
}

export async function getFormWithQuestions(formId: string) {
  const prisma = getPrisma()
  return prisma.form.findUnique({
    where: { id: formId },
    include: { questions: true }
  })
}

export async function getFormById(formId: string) {
  const prisma = getPrisma()
  return prisma.form.findUnique({
    where: { id: formId }
  })
}

export async function findExistingAnswer(formId: string, userId: number) {
  const prisma = getPrisma()
  return prisma.answersGroup.findFirst({
    where: {
      form_id: formId,
      user_id: userId
    }
  })
}
