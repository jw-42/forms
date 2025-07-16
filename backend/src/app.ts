import { Hono } from 'hono'
import { router } from '@shared/config'
import { ApiError } from '@shared/utils'
import { ErrorHandlerMiddleware } from '@shared/middleware'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { runVkBot } from '@features/vk-bot'

const app = new Hono()

app.use(logger())

app.use(cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.route('/', router)

app.notFound(() => { throw ApiError.NotFound() })
app.onError(ErrorHandlerMiddleware)

runVkBot()

export default {
  port: 8000,
  fetch: app.fetch,
}
