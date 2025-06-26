import { Hono } from 'hono'

import { default as getAnswersByUser } from './api/getByUser'

const myAnswersRouter = new Hono()

// Get all answers by current user
myAnswersRouter.get('/', ...getAnswersByUser)

export default myAnswersRouter