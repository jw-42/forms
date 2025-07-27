import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class ApiError extends Error {
  status: ContentfulStatusCode
  error_details: unknown[]

  constructor(status: ContentfulStatusCode, message: string, error_details: unknown[] = []) {
    super(message)
    this.status = status
    this.error_details = error_details
  }

  static BadRequest(message: string = 'One or more vparameters is invalid or not provided', error_details: unknown[] = []) {
    return new ApiError(400, message, error_details)
  }

  static Unauthorized(message: string = 'User is not authorized') {
    return new ApiError(401, message)
  }

  static NotFound(message: string = 'Resource not found') {
    return new ApiError(404, message)
  }

  static Forbidden(message?: string) {
    return new ApiError(403, `Access denied${message ? `: ${message}` : ''}`);
  }

  static Conflict(message: string = 'Request conflicts with current state') {
    return new ApiError(409, message)
  }

  static Internal(message: string = 'Internal server error') {
    return new ApiError(500, message)
  }
}