import { Hono } from 'hono'
import { authRouter, formsRouter, questionsRouter } from '@features/index'
import AuthorizationMiddleware from '@shared/middleware/authorization'

const app = new Hono()
app.basePath('/api')

app.route('/auth', authRouter)

app.use(AuthorizationMiddleware)

app.route('/forms', formsRouter)
app.route('/forms/:form_id/questions', questionsRouter)

export default app