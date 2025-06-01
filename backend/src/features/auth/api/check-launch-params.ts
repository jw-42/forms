import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { launchParamsSchema } from '../types'
import AuthService from '../service'

const factory = createFactory()

const checkVkLaunchParams = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.json()
    const result = launchParamsSchema.safeParse(body)
    
    if (!result.success) {
      console.log('invalid launch params', result.error)
      throw ApiError.BadRequest()
    }
    
    const access_token = await AuthService.handleAuth(result.data)

    console.log('access_token', access_token)

    return ctx.json({ access_token })
  } catch (error) {
    console.group('Authorization error')
    console.error(error)
    console.groupEnd()

    if (error instanceof ApiError) {
      throw error;
    } else {
      console.error(error)
      throw ApiError.Internal();
    }
  }
})

export default checkVkLaunchParams