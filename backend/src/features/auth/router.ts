import { Hono } from 'hono'
import { chechVkLaunchParams } from './api'

const router = new Hono()

router.post('/login', ...chechVkLaunchParams)

export default router