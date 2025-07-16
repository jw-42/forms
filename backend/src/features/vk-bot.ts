import { VK, MessageContext } from 'vk-io'
import getPrisma from '@infra/database/prisma'

const ALLOWED_ADMINS = [374811416]

const vk = new VK({
  token: Bun.env.VK_GROUP_TOKEN || ''
})

type CommandContext = {
  ctx: MessageContext
  args: string[]
  prisma: ReturnType<typeof getPrisma>
}

type CommandHandler = (context: CommandContext) => Promise<void>

type CommandConfig = {
  handler: CommandHandler
  allowedUsers?: number[]
}

const commands: Record<string, CommandConfig> = {
  ban: {
    handler: async ({ ctx, args, prisma }) => {
      const id = args[0]
      if (!id || !/^\d+$/.test(id)) {
        await ctx.send('Usage: /ban <user_id> (user_id must be a number)')
        return
      }
      const userId = Number(id)
      await prisma.user.updateMany({ where: { id: userId }, data: { is_banned: true } })
      await ctx.send(`User ${userId} banned`)
    },
    allowedUsers: ALLOWED_ADMINS
  },
  unban: {
    handler: async ({ ctx, args, prisma }) => {
      const id = args[0]
      if (!id || !/^\d+$/.test(id)) {
        await ctx.send('Usage: /unban <user_id> (user_id must be a number)')
        return
      }
      const userId = Number(id)
      await prisma.user.updateMany({ where: { id: userId }, data: { is_banned: false } })
      await ctx.send(`User ${userId} unbanned`)
    },
    allowedUsers: ALLOWED_ADMINS
  },
  echo: {
    handler: async ({ ctx, args }) => {
      if (args.length === 0) {
        await ctx.send('Usage: /echo <text>')
        return
      }
      await ctx.send(args.join(' '))
    }
    // allowedUsers не задан — команда доступна всем
  }
}

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

export function runVkBot() {
  vk.updates.start().catch(console.error)
} 