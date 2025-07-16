import { createHmac } from 'crypto'
import type { LaunchParams } from './types'
import { ApiError } from '@shared/utils'
import { sign } from 'hono/jwt'
import { AuthRepository } from './repository'
import { API } from 'vk-io'

class AuthService {
  private readonly clientSecret: string;
  private readonly authRepository: AuthRepository;

  constructor() {
    this.clientSecret = `${Bun.env.APP_SECRET}`
    this.authRepository = new AuthRepository()
  }

  validateLaunchParams(params: LaunchParams): boolean {
    const { sign, ...otherParams } = params;
    
    if (!sign) {
      return false;
    }

    // Filter and sort vk_ parameters
    const vkParams = Object.entries(otherParams)
      .filter(([key]) => key.startsWith('vk_'))
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    // Create query string
    const queryString = vkParams
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Calculate hash
    const hash = createHmac('sha256', this.clientSecret)
      .update(queryString)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return hash === sign;
  }

  async handleAuth(params: LaunchParams) {
    if (!this.validateLaunchParams(params)) {
      throw new Error('Invalid launch params')
    }

    const vk_user_id = params?.vk_user_id
    if (!vk_user_id) {
      throw new Error('vk_user_id is required')
    }

    let user = await this.authRepository.findUserByVkId(vk_user_id)

    if (!user) {
      user = await this.authRepository.createUser(vk_user_id)

      const api = new API({
        token: `${Bun.env.VK_GROUP_TOKEN}`
      })

      const userInfo = await api.users.get({
        user_ids: [vk_user_id]
      })

      await api.messages.send({
        peer_id: 374811416,
        message: `Новый пользователь: ${userInfo[0]?.first_name} ${userInfo[0]?.last_name}`
      })
    }

    if (user.is_banned) {
      throw ApiError.Forbidden('Access denied: user is banned')
    }

    const expires_at = new Date(Date.now() + 1000 * 60 * 60)

    const payload = {
      uid: user.id,
      exp: expires_at.getTime()
    }

    const access_token = await sign(payload, `${Bun.env.ACCESS_TOKEN_SECRET}`)

    await this.authRepository.createSession(user.id, access_token, expires_at)

    return access_token
  }
}

export default new AuthService()