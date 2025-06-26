import { Hono } from 'hono'

import { default as submitAnswers } from './api/submit'
import { default as getAnswersByForm } from './api/getByForm'
import { default as getAnswersGroupById } from './api/getById'
import { default as deleteAnswersGroup } from './api/delete'
import { default as getAnswersSummary } from './api/getSummary'
import { default as getQuestionSummary } from './api/getQuestionSummary'

const answersRouter = new Hono()

// Submit answers to a form
answersRouter.post('/', ...submitAnswers)

// Get all answers for a specific form (form owner only)
answersRouter.get('/', ...getAnswersByForm)

// Get answers summary for a form (form owner only)
answersRouter.get('/summary', ...getAnswersSummary)

// Get answers group by ID
answersRouter.get('/:answers_group_id', ...getAnswersGroupById)

// Delete answers group
answersRouter.delete('/:answers_group_id', ...deleteAnswersGroup)

// Get question summary (must be after /:answers_group_id to avoid conflicts)
answersRouter.get('/summary/:question_id', ...getQuestionSummary)

export default answersRouter
