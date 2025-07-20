import { Hono } from 'hono'

import { submit } from './api/submit'
import { get } from './api/get'
import { getById } from './api/getById'
import { deleteByUserId } from './api/delete'

const router = new Hono()

router.post('/', ...submit)
router.get('/', ...get)
router.get('/:answers_group_id', ...getById)
router.delete('/:user_id', ...deleteByUserId)

export default router