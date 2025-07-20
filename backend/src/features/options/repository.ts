import { getPrisma } from '@infra/database'
import type { CreateOptionsProps, UpdateOptionProps } from './types';

class OptionsRepository {
  async create(data: CreateOptionsProps) {
    const passedOptionsIds = data.options
      .filter(option => option.id)
      .map(option => option.id!)

    const prisma = getPrisma()

    const deleteOperations = passedOptionsIds.length > 0
      ? [prisma.option.deleteMany({
          where: {
            question_id: data.question_id,
            id: { notIn: passedOptionsIds }
          }
        })]
      : [prisma.option.deleteMany({
          where: {
            question_id: data.question_id,
          }  
        })]

    const upsertOperations = data.options.map((option, index) => {
      if (option.id) {
        return prisma.option.update({
          where: {
            id: option.id,
            question_id: data.question_id,
          },
          data: {
            text: option.text,
            order: option.order ?? index,
          }
        })
      } else {
        return prisma.option.create({
          data: {
            question_id: data.question_id,
            text: option.text,
            order: option.order ?? index,
          }
        })
      }
    })

    const result = await prisma.$transaction([
      ...deleteOperations,
      ...upsertOperations
    ])

    return result.slice(deleteOperations.length)
  }

  async get(question_id: number) {
    const prisma = getPrisma()
    return await prisma.option.findMany({
      where: {
        question_id,
      },
      orderBy: {
        order: 'asc',
      }
    })
  }

  async getById(option_id: number) {
    const prisma = getPrisma()
    return await prisma.option.findUnique({
      where: {
        id: option_id,
      }
    })
  }

  async update(form_id: string, question_id: number, option_id: number, data: UpdateOptionProps) {
    const prisma = getPrisma()
    return await prisma.option.update({
      where: {
        id: option_id,
        question: {
          id: question_id,
          form_id
        }
      },
      data,
    })
  }

  async deleteById(form_id: string, question_id: number, option_id: number) {
    const prisma = getPrisma()
    return await prisma.option.delete({
      where: {
        id: option_id,
        question: {
          id: question_id,
          form_id
        }
      }
    })
  }
}

export default new OptionsRepository()