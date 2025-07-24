import { Hono } from 'hono'

import { getSubscription } from './api/getSubscription'

const router = new Hono()

router.post('/', ...getSubscription)

export default router