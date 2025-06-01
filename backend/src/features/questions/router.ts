import { Hono } from 'hono'

import { default as createQuestion } from './api/create'
import { default as getAllQuestions } from './api/getAll'
import { default as getQuestionById } from './api/getById'
import { default as updateQuestion } from './api/update'
import { default as deleteQuestion } from './api/delete'

const questionsRouter = new Hono()

questionsRouter.post('/', ...createQuestion)
questionsRouter.get('/', ...getAllQuestions)
questionsRouter.get('/:question_id', ...getQuestionById)
questionsRouter.put('/:question_id', ...updateQuestion)
questionsRouter.delete('/:question_id', ...deleteQuestion)

export default questionsRouter 