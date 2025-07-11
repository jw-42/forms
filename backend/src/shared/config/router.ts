import { Hono } from 'hono'
import { authRouter, formsRouter, questionsRouter, answersRouter, optionsRouter } from '@features/index'
import AuthorizationMiddleware from '@shared/middleware/authorization'

const app = new Hono()
app.basePath('/api')

app.route('/auth', authRouter)

app.use(AuthorizationMiddleware)

app.route('/forms', formsRouter)
app.route('/forms/:form_id/questions', questionsRouter)
app.route('/forms/:form_id/questions/:question_id/options', optionsRouter)
app.route('/forms/:form_id/answers', answersRouter)

export default app