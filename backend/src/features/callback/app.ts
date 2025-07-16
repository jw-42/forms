import { VK, MessageContext, MessageSubscriptionContext } from 'vk-io'
import getPrisma from '@infra/database/prisma'
import { commands } from "./commands"

const vk = new VK({
  token: Bun.env.VK_GROUP_TOKEN || ''
})

vk.updates.on('message_new', async (ctx: MessageContext) => {
  if (!ctx.isOutbox && ctx.isUser) {
    const [cmd, ...args] = (ctx.text ?? '').trim().split(/\s+/)
    const command = cmd?.replace(/^\//, '').toLowerCase()
    if (!command) return
    const config = commands[command]
    if (config) {
      if (config.allowedUsers && !config.allowedUsers.includes(ctx.senderId)) {
        return // Нет доступа
      }
      await config.handler({ ctx, args, prisma: getPrisma() })
    }
  }
})

export function runLongPoll() {
  vk.updates.start()
    .then(() => console.log('LongPoll started'))
    .catch(console.error)
}