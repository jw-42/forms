import { getPrisma } from '@infra/database'

class UsersRepository {
  async create(id: number) {
    const prisma = getPrisma()
    return await prisma.user.create({
      data: { id },
      select: {
        id: true,
        is_banned: true,
        created_at: true,
      }
    })
  }

  async getById(id: number) {
    const prisma = getPrisma()
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        is_banned: true,
        created_at: true,
      }
    })
  }

  async updateHasSubscription(id: number, hasSubscription: boolean) {
    const prisma = getPrisma()
    return await prisma.user.update({
      where: { id },
      data: { has_subscription: hasSubscription },
      select: {
        id: true,
        is_banned: true,
        has_subscription: true,
        created_at: true,
      }
    })
  }
}

export default new UsersRepository()