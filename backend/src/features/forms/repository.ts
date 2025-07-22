import { getPrisma } from "@infra/database"
import type { CreateFormInput, UpdateFormInput } from "./types"

class FormsRepository {
  async create(owner_id: number, data: CreateFormInput) {
    const prisma = getPrisma()

    return await prisma.$transaction(async (tx) => {
      const form = await tx.form.create({
        data: {
          owner_id,
          ...data,
        },
        select: {
          id: true,
          title: true,
          owner_id: true,
          privacy_policy: true,
        }
      })

      // await tx.dataProcessingAgreementLog.create({
      //   data: {
      //     ...legal,
      //     form_id: form.id,
      //     user_id: owner_id,
      //   }
      // })

      return form
    })
  }

  async get(owner_id: number, count: number = 10, offset: number = 0) {
    const prisma = getPrisma()
    return await prisma.form.findMany({
      where: {
        owner_id,
      },
      skip: offset,
      take: count,
      orderBy: { updated_at: 'desc' },
      select: {
        id: true,
        owner_id: true,
        title: true,
        updated_at: true,
      }
    })
  }

  async getById(form_id: string) {
    const prisma = getPrisma()
    return await prisma.form.findUnique({
      where: {
        id: form_id,
      },
      select: {
        id: true,
        owner_id: true,
        title: true,
        description: true,
        notifications: true,
        privacy_policy: true,
        created_at: true,
        updated_at: true,
      }
    })
  }

  async update(form_id: string, data: UpdateFormInput) {
    const prisma = getPrisma()
    return await prisma.form.update({
      where: { id: form_id },
      data,
      select: {
        id: true,
        owner_id: true,
        title: true,
        description: true,
        created_at: true,
        updated_at: true,
      }
    })
  }

  async delete(form_id: string) {
    const prisma = getPrisma()
    return await prisma.form.delete({
      where: { id: form_id },
    })
  }

  async count(owner_id: number) {
    const prisma = getPrisma()
    return await prisma.form.count({
      where: { owner_id }
    })
  }
}

export default new FormsRepository()