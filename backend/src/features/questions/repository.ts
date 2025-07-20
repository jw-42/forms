import type { CreateQuestionProps, UpdateQuestionProps } from './types'
import { getPrisma } from '@infra/database'

class QuestionsRepository {
  private readonly defaultInclude = {
    options: {
      select: {
        id: true,
        text: true,
        order: true,
      }
    }
  }

  async create(data: CreateQuestionProps) {
    const prisma = getPrisma()
    return await prisma.question.create({ data })
  }

  async getByFormId(form_id: string, include: object = this.defaultInclude) {
    const prisma = getPrisma()
    return await prisma.question.findMany({
      where: { form_id },
      include,
      orderBy: { created_at: 'asc' }
    })
  }

  async getById(form_id: string, question_id: number, include: object = this.defaultInclude) {
    const prisma = getPrisma()
    return await prisma.question.findUnique({
      where: {
        id: question_id,
        form_id,
      },
      include,
    })
  }

  async update(form_id: string, question_id: number, data: UpdateQuestionProps) {
    const prisma = getPrisma()
    return await prisma.question.update({
      where: {
        id: question_id,
        form_id,
      },
      data,
    })
  }

  async deleteById(form_id: string, question_id: number) {
    const prisma = getPrisma()
    return await prisma.question.delete({
      where: {
        id: question_id,
        form_id,
      },
      select: {
        id: true,
      }
    })
  }
}

export default new QuestionsRepository()