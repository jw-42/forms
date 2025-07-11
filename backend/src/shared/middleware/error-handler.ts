import type { Context } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import { ApiError } from "@shared/utils"

export const ErrorHandlerMiddleware = async (error: any, ctx: Context) => {
  if (error instanceof ApiError) {
    return ctx.json({
      error_code: error.status,
      error_message: error.message,
      ...(error.errors.length && { error_details: error.errors })
    }, error.status as ContentfulStatusCode)
  } else {
    return ctx.json({
      error_code: 500,
      error_message: 'Internal server error',
    }, 500)
  }
}