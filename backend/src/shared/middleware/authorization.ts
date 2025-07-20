import { ApiError } from '@shared/utils'
import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { authRepository } from '@features/index'

export const AuthorizationMiddleware = async (ctx: Context, next: Next) => {
  const header = ctx.req.header('Authorization')

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.Unauthorized()
  }

  try {
    const access_token = header.split(' ')[1]

    const decoded = await verify(
      access_token as string,
      Bun.env.ACCESS_TOKEN_SECRET as string,
    )

    if (decoded.uid && decoded.exp) {
      const session = await authRepository.getSession(
        access_token as string,
        decoded.uid as number
      )

      if (!session) {
        throw ApiError.Unauthorized('Session expired')
      }

      ctx.set('uid', decoded.uid)
    } else {
      throw ApiError.Unauthorized('Invalid access token')
    }

    return next()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      console.error('Authorization middleware error:', error);
      throw ApiError.Unauthorized('Invalid access token');
    }
  }
}