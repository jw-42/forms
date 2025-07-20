import { getPrisma } from '@infra/database'

class AuthRepository {
  async createSession(user_id: number, access_token: string, expires_at: Date) {
    const prisma = getPrisma()
    return await prisma.session.create({
      data: {
        user_id,
        access_token,
        expires_at,
      },
      select: {
        access_token: true,
      }
    })
  }

  async getSession(access_token: string, user_id: number) {
    const prisma = getPrisma()
    return await prisma.session.findUnique({
      where: {
        access_token,
        expires_at: {
          gt: new Date()
        },
        user: {
          id: user_id,
          is_banned: false,
        }
      }
    })
  }
}

export default new AuthRepository()