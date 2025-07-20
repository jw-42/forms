import authRepository from './repository'
import usersRepository from '../users/repository'
import { ApiError } from '@shared/utils'
import { createHmac } from 'crypto'
import { VK } from 'vk-io'
import { sign } from 'hono/jwt'
import type { LaunchParams } from './types'
import { sendNewUserEvent } from '@infra/kafka/producer'

class AuthService {
  private readonly client_secret: string
  private readonly auth_repository: typeof authRepository
  private readonly users_repository: typeof usersRepository
  private readonly vk: VK

  constructor() {
    this.client_secret = Bun.env.APP_SECRET as string
    this.auth_repository = authRepository
    this.users_repository = usersRepository
    this.vk = new VK({
      token: Bun.env.VK_GROUP_TOKEN as string
    })
  }

  async authenticate(params: LaunchParams) {
    if (!this.validateLaunchParams(params)) {
      throw ApiError.Unauthorized('Can not validate launch params')
    }

    const { vk_user_id } = params

    let user = await this.users_repository.getById(vk_user_id!)

    if (!user) {
      user = await this.users_repository.create(vk_user_id!)
      void sendNewUserEvent({
        user_id: user.id,
      })
    }

    if (user.is_banned) {
      throw ApiError.Forbidden('User is banned')
    }

    const expires_at = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    const access_token = await sign(
      {
        uid: user.id,
        exp: expires_at.getTime(),
      },
      Bun.env.ACCESS_TOKEN_SECRET as string
    )

    const session = await this.auth_repository.createSession(user.id, access_token, expires_at)

    if (!session) {
      throw ApiError.Internal('Failed to create session')
    }

    return session
  }

  private async validateLaunchParams(params: LaunchParams) {
    const { sign, ...other_params } = params

    if (!sign) {
      return false
    }

    const vk_params = Object.entries(other_params)
      .filter(([key]) => key.startsWith('vk_'))
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))

    const query_string = vk_params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

    const hash = createHmac('sha256', this.client_secret)
      .update(query_string)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    return hash === sign
  }
}

export default new AuthService()