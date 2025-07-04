import { getPrisma } from '@infra/database'

export class AuthRepository {
  async findUserByVkId(id: number) {
    const prisma = getPrisma()
    return prisma.user.findUnique({
      where: { id }
    })
  }

  async createUser(id: number) {
    const prisma = getPrisma()
    return prisma.user.create({
      data: { id }
    })
  }

  async createSession(user_id: number, access_token: string, expires_at: Date) {
    const prisma = getPrisma()
    return prisma.session.create({
      data: {
        user_id,
        access_token,
        expires_at
      }
    })
  }
}
