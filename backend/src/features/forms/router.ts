import { Hono } from 'hono'

import { create } from './api/create'
import { get } from './api/get'
import { getById } from './api/getById'
import { update } from './api/update'
import { deleteById } from './api/delete'

const router = new Hono()

router.post('/', ...create)
router.get('/', ...get)
router.get('/:form_id', ...getById)
router.put('/:form_id', ...update)
router.delete('/:form_id', ...deleteById)

export default router