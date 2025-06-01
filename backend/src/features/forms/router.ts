import { Hono } from 'hono'

import { default as createForm } from './api/create'
import { default as getAll } from './api/getAll'
import { default as getById } from './api/getById'
import { default as updateForm } from './api/update'
import { default as deleteForm } from './api/delete'

const formsRouter = new Hono()

formsRouter.post('/', ...createForm)
formsRouter.get('/', ...getAll)
formsRouter.get('/:form_id', ...getById)
formsRouter.put('/:form_id', ...updateForm)
formsRouter.delete('/:form_id', ...deleteForm)

export default formsRouter