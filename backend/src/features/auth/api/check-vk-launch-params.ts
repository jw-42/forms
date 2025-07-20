import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { launchParamsSchema } from '../types'
import { ApiError } from '@shared/utils'
import authService from '../service'

const factory = createFactory()

const chechVkLaunchParams = factory.createHandlers(async (ctx: Context, next: Next) => {
  try {
    const body = await ctx.req.json()
    const result = launchParamsSchema.safeParse(body)

    if (!result.success) {
      console.log('Invalid launch params', result.error)
      throw ApiError.BadRequest('Invalid launch params')
    }

    const access_token = await authService.authenticate(result.data)

    return ctx.json(access_token)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw ApiError.Internal();
    }
  }
})

export default chechVkLaunchParams