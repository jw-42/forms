import { Hono } from 'hono'

import { default as submitAnswers } from './api/submit'
import { default as deleteAnswersGroup } from './api/delete'
import { default as getByUserAndForm } from './api/getByUserAndForm'
import { default as getAllByForm } from './api/getAllByForm'

const answersRouter = new Hono()

// Submit answers to a form
answersRouter.post('/', ...submitAnswers)

// Get all answers for a form (form owner only)
answersRouter.get('/', ...getAllByForm)

// Get answers by user and form
answersRouter.get('/:user_id', ...getByUserAndForm)

// Delete answers group
answersRouter.delete('/:user_id', ...deleteAnswersGroup)

export default answersRouter
