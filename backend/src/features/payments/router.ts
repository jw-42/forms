import { Hono } from 'hono'

import { getSubscription } from './api/getSubscription'

const router = new Hono()

router.get('/', ...getSubscription)

export default router