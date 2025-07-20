import { Hono } from 'hono'
import { answersRouter, authRouter, formsRouter, optionsRouter, questionsRouter } from '@features/index'
import { AuthorizationMiddleware } from '@shared/middleware/authorization'

const app = new Hono()

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.basePath('/api')

app.route('/auth', authRouter)

app.use(AuthorizationMiddleware)

app.route('/forms', formsRouter)
app.route('/forms/:form_id/questions', questionsRouter)
app.route('/forms/:form_id/questions/:question_id/options', optionsRouter)
app.route('/forms/:form_id/answers', answersRouter)

export default app