import { ApiError } from '@shared/utils'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export const ErrorHandlerMiddleware = (error: unknown, ctx: Context) => {
  if (error instanceof ApiError) {
    return ctx.json({
      error_code: error.status,
      error_message: error.message,
      ...(error.error_details.length > 0 && { error_details: error.error_details })
    }, error.status as ContentfulStatusCode)
  } else {
    return ctx.json({
      error_code: 500,
      error_message: 'Internal server error'
    }, 500)
  }
}