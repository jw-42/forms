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

  async getUserWithSubscriptions(id: number) {
    const prisma = getPrisma()
    return await prisma.user.findUnique({
      where: { id },
      include: {
        subscription: {
          where: {
            status: {
              in: ['active', 'chargeable']
            }
          },
          orderBy: {
            subscription_id: 'desc'
          }
        }
      }
    })
  }
}

export default new UsersRepository()