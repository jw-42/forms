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

async function resolveUserId(arg: string): Promise<number | null> {
  if (/^\d+$/.test(arg)) return Number(arg)
  try {
    const res = await vk.api.utils.resolveScreenName({ screen_name: arg })
    return res && res.type === 'user' ? res.object_id : null
  } catch {
    return null
  }
}

const commands: Record<string, CommandHandler> = {
  ban: async ({ ctx, args, prisma }) => {
    if (!args[0]) {
      await ctx.send('Usage: /ban <user_id|domain>')
      return
    }
    const userId = await resolveUserId(args[0])
    if (!userId) {
      await ctx.send('User not found')
      return
    }
    await prisma.user.updateMany({ where: { id: userId }, data: { is_banned: true } })
    await ctx.send(`User ${userId} banned`)
  },
  unban: async ({ ctx, args, prisma }) => {
    if (!args[0]) {
      await ctx.send('Usage: /unban <user_id|domain>')
      return
    }
    const userId = await resolveUserId(args[0])
    if (!userId) {
      await ctx.send('User not found')
      return
    }
    await prisma.user.updateMany({ where: { id: userId }, data: { is_banned: false } })
    await ctx.send(`User ${userId} unbanned`)
  },
  // Пример новой команды с валидацией числа аргументов
  echo: async ({ ctx, args }) => {
    if (args.length === 0) {
      await ctx.send('Usage: /echo <text>')
      return
    }
    await ctx.send(args.join(' '))
  }
}

vk.updates.on('message_new', async (ctx: MessageContext) => {
  if (!ctx.isOutbox && ctx.isUser && ALLOWED_ADMINS.includes(ctx.senderId)) {
    const [cmd, ...args] = (ctx.text ?? '').trim().split(/\s+/)
    const command = cmd?.replace(/^\//, '').toLowerCase()
    if (!command) return
    const handler = commands[command]
    if (handler) {
      await handler({ ctx, args, prisma: getPrisma() })
    }
  }
})

export function runVkBot() {
  vk.updates.start()
    .then(() => console.log('VK bot started'))
    .catch(console.error)
} 