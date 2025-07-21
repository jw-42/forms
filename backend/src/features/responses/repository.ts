import { getPrisma } from '@infra/database'
import type { SubmitAnswers } from './types';

class AnswersRepository {
  async submit(data: SubmitAnswers) {
    const prisma = getPrisma()
    return prisma.$transaction(async (tx) => {
      const { id: answers_group_id } = await tx.answersGroup.create({
        data: {
          form_id: data.form_id,
          user_id: data.user_id,
        },
        select: {
          id: true,
        }
      })

      await tx.answer.createMany({
        data: data.answers.map((answer) => ({
          answers_group_id,
          question_id: answer.question_id,
          value: answer.value
        }))
      })

      return { id: answers_group_id }
    })
  }

  async get(form_id: string) {
    const prisma = getPrisma()
    return prisma.answersGroup.findMany({
      where: { form_id },
      select: {
        id: true,
        user_id: true,
        created_at: true,
      }
    })
  }

  async getById(form_id: string, user_id: number) {
    const prisma = getPrisma()
    return prisma.answersGroup.findFirst({
      where: { form_id, user_id },
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
                type: true,
                options: {
                  select: {
                    id: true,
                    text: true,
                    order: true,
                  }
                }
              }
            }
          },
          orderBy: {
            question: {
              created_at: 'asc'
            }
          }
        }
      }
    })
  }

  async deleteByUserId(form_id : string, user_id: number) {
    const prisma = getPrisma()
    return prisma.answersGroup.deleteMany({
      where: { form_id, user_id }
    })
  }
}

export default new AnswersRepository()