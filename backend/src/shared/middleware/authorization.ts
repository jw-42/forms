import type { Context, Next } from 'hono'
import { ApiError } from '@shared/utils'
import { verify } from 'hono/jwt'
import { getPrisma } from '@infra/database'

export const AuthorizationMiddleware = async (ctx: Context, next: Next) => {

  const header = ctx.req.header('Authorization')

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.Unauthorized()
  }

  try {
    const access_token = header.split('Bearer ')[1]  

    const decoded = await verify(
      `${access_token}`,
      `${Bun.env.ACCESS_TOKEN_SECRET}`
    )

    if (decoded.uid && decoded.exp) {
      const prisma = getPrisma()

      const session = await prisma.session.findFirst({
        where: {
          access_token,
          expires_at: {
            gt: new Date()
          },
          user: {
            id: decoded.uid,
            is_banned: false
          }
        }
      })

      if (!session) {
        throw ApiError.Forbidden("Access denied: session expired")
      }

      ctx.set('uid', decoded.uid)
    } else {
      throw ApiError.Forbidden("Access denied: invalid token")
    }

    return next()
    
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
}

export default AuthorizationMiddleware