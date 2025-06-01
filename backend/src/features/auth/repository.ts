import { getPrisma } from '@infra/database'

export class AuthRepository {
  async findUserByVkId(vk_user_id: number) {
    const prisma = getPrisma()
    return prisma.user.findUnique({
      where: { vk_user_id }
    })
  }

  async createUser(vk_user_id: number) {
    const prisma = getPrisma()
    return prisma.user.create({
      data: { vk_user_id }
    })
  }

  async createSession(user_id: string, access_token: string, expires_at: Date) {
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
