import { router } from '@shared/config'
import { ErrorHandlerMiddleware, customLogger } from '@shared/middleware'
import { ApiError } from '@shared/utils'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(customLogger())

app.use(cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.route('/', router)

app.notFound(() => { throw ApiError.NotFound() })

app.onError(ErrorHandlerMiddleware)

export default {
  port: 8000,
  fetch: app.fetch,
}