import { Hono } from 'hono'

import { default as getAllOptions } from './api/getAll'
import { default as getOptionById } from './api/getById'
import { default as updateOption } from './api/update'
import { default as deleteOption } from './api/delete'
import { default as createOptions } from './api/createMultiple'

const optionsRouter = new Hono()

optionsRouter.post('/', ...createOptions)
optionsRouter.get('/', ...getAllOptions)
optionsRouter.get('/:option_id', ...getOptionById)
optionsRouter.put('/:option_id', ...updateOption)
optionsRouter.delete('/:option_id', ...deleteOption)

export default optionsRouter
