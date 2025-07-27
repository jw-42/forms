import { Hono } from 'hono'
import { SubscriptionLimitMiddleware } from '@shared/middleware/subscription-check'

import { create } from './api/create'
import { get } from './api/get'
import { getById } from './api/getById'
import { update } from './api/update'
import { deleteById } from './api/delete'
import { getDataProccessingAgreement } from './api/getDataProccessingAgreement'
import { getPersonalDataAgreement } from './api/getPersonalDataAgreement'

const router = new Hono()

router.post('/', SubscriptionLimitMiddleware('create_form'), ...create)
router.get('/', ...get)
router.get('/:form_id', ...getById)
router.get('/:form_id/data-proccessing', ...getDataProccessingAgreement)
router.get('/:form_id/personal-data', ...getPersonalDataAgreement)
router.put('/:form_id', ...update)
router.delete('/:form_id', ...deleteById)

export default router