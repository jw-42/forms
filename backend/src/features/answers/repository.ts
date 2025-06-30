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

export async function getAnswersGroupsByUser(userId: string) {
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
  const result = await prisma.answersGroup.findUnique({
    where: { id: answersGroupId },
    select: {
      id: true,
      user_id: true,
      form_id: true,
      created_at: true,
      Answer: {
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

  if (!result) return null

  // Transform the response to rename Answer to items
  return {
    ...result,
    items: result.Answer,
    Answer: undefined
  }
}

export async function deleteAnswersGroup(answersGroupId: string) {
  const prisma = getPrisma()
  return prisma.answersGroup.delete({
    where: { id: answersGroupId },
    select: { id: true }
  })
}

export async function getAnswersSummary(formId: string) {
  const prisma = getPrisma()
  
  // Get total responses count
  const total_responses = await prisma.answersGroup.count({
    where: { form_id: formId }
  })

  // Get questions with their response counts
  const questions_summary = await prisma.question.findMany({
    where: { form_id: formId },
    select: {
      id: true,
      text: true,
      type: true,
      _count: {
        select: {
          Answer: true
        }
      }
    },
    orderBy: { created_at: 'asc' }
  })

  // Get recent responses (last 5)
  const recent_responses = await prisma.answersGroup.findMany({
    where: { form_id: formId },
    select: {
      id: true,
      created_at: true,
      user_id: true
    },
    orderBy: { created_at: 'desc' },
    take: 5
  })

  return {
    total_responses,
    questions_summary: questions_summary.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      response_count: q._count.Answer
    })),
    recent_responses
  }
}

export async function getQuestionSummary(formId: string, questionId: string) {
  const prisma = getPrisma()
  
  // Get question details
  const question = await prisma.question.findFirst({
    where: { 
      id: questionId,
      form_id: formId
    },
    select: {
      id: true,
      text: true,
      type: true
    }
  })

  if (!question) return null

  // Get all answers for this question
  const answers = await prisma.answer.findMany({
    where: {
      question_id: questionId,
      answers_group: {
        form_id: formId
      }
    },
    select: {
      value: true,
      created_at: true,
      answers_group: {
        select: {
          user_id: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  })

  // For text questions, we can provide some basic analytics
  const total_answers = answers.length
  const unique_answers = new Set(answers.map(a => a.value)).size

  // Get most common answers (top 5)
  const answer_counts = answers.reduce((acc, answer) => {
    acc[answer.value] = (acc[answer.value] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const most_common_answers = Object.entries(answer_counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([value, count]) => ({ value, count }))

  return {
    question,
    total_answers,
    unique_answers,
    most_common_answers,
    recent_answers: answers.slice(0, 10).map(a => ({
      value: a.value,
      created_at: a.created_at,
      user_id: a.answers_group.user_id
    }))
  }
}

export async function hasUserAnsweredForm(formId: string, userId: string) {
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
