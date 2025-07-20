import { VK, Params, Keyboard } from 'vk-io'

class VkService {
  private vk: VK

  /**
   * Список IDs администраторов
   */
  public readonly admins: number[] = [
    374811416
  ]

  constructor() {
    this.vk = new VK({
      token: Bun.env.VK_GROUP_TOKEN as string
    })
  }

  async getUserInfo(user_ids: number[], params?: Omit<Params.UsersGetParams, 'user_ids'>) {
    try {
      return await this.vk.api.users.get({ user_ids, ...params })
    } catch (error) {
      console.error('Failed to get user names', error)
      return []
    }
  }

  async sendMessage(peer_ids: number[], message: string, attachments?: string[], keyboard?: Keyboard) {
    return await this.vk.api.messages.send({
      random_id: Date.now(),
      peer_ids,
      message,
      ...(attachments && { attachment: attachments }),
      ...(keyboard && { keyboard }),
    })
  }
}

export default new VkService()