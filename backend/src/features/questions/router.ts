import { Hono } from 'hono'
import { SubscriptionLimitMiddleware } from '@shared/middleware/subscription-check'

import { create } from './api/create'
import { get } from './api/get'
import { getById } from './api/getById'
import { update } from './api/update'
import { deleteById } from './api/delete'
import { generateDescription } from './api/generate-description'

const router = new Hono()

router.post('/', SubscriptionLimitMiddleware('add_question'), ...create)
router.post('/:question_id/generate-description', ...generateDescription)
router.get('/', ...get)
router.get('/:question_id', ...getById)
router.put('/:question_id', ...update)
router.delete('/:question_id', ...deleteById)

export default router