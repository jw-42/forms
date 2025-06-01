import { Hono } from 'hono'
import { default as checkVkLaunchParams } from './api/check-launch-params'

const authRouter = new Hono()

authRouter.post('/login',  ...checkVkLaunchParams)

export default authRouter