import { Hono } from 'hono'
import { router } from '@shared/config'
import { ApiError } from '@shared/utils'
import { ErrorHandlerMiddleware } from '@shared/middleware'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(logger())

app.route('/', router)

app.notFound(() => { throw ApiError.NotFound() })
app.onError(ErrorHandlerMiddleware)

export default {
  port: 8000,
  fetch: app.fetch,
}
