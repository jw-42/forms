import { MessageContext } from 'vk-io'
import getPrisma from '@infra/database/prisma'

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

export const ALLOWED_ADMINS = [374811416]

export const commands: Record<string, CommandConfig> = {
  ban: {
    handler: async ({ ctx, args, prisma }) => {
      const id = args[0]
      if (!id || !/^\d+$/.test(id)) {
        await ctx.send('Используйте: /ban <user_id> (user_id должен быть числом)')
        return
      }
      const userId = Number(id)
      await prisma.user.updateMany({ where: { id: userId }, data: { is_banned: true } })
      await ctx.send(`User id${userId} banned`)
    },
    allowedUsers: ALLOWED_ADMINS
  },
  unban: {
    handler: async ({ ctx, args, prisma }) => {
      const id = args[0]
      if (!id || !/^\d+$/.test(id)) {
        await ctx.send('Используйте: /unban <user_id> (user_id должен быть числом)')
        return
      }
      const userId = Number(id)
      await prisma.user.updateMany({ where: { id: userId }, data: { is_banned: false } })
      await ctx.send(`User id${userId} unbanned`)
    },
    allowedUsers: ALLOWED_ADMINS
  },
  forms: {
    handler: async ({ ctx, args, prisma }) => {
      const actions: Record<string, CommandHandler> = {
        list: async ({ ctx, args, prisma }) => {
          if (!args[1] || !/^\d+$/.test(args[1])) {
            await ctx.send('Используйте: /forms list <user_id>')
            return
          }
          const userId = Number(args[1])
          const forms = await prisma.form.findMany({
            where: { owner_id: userId },
            select: {
              id: true,
              title: true
            },
            orderBy: {
              created_at: 'desc'
            }
          })
          if (!forms.length) {
            await ctx.send(`У пользователя id${userId} нет анкет`)
            return
          }
          const msg = forms.map(f => `• ${f.title} (id: ${f.id})`).join('\n')
          await ctx.send(`Анкеты пользователя id${userId}:\n${msg}`)
        },
      }
      const action = args[0]
      if (!action) {
        await ctx.send(`Доступные действия: ${Object.keys(actions).join(', ')}`)
        return
      }
      const actionHandler = actions[action]
      if (!actionHandler) {
        await ctx.send(`Доступные действия: ${Object.keys(actions).join(', ')}`)
        return
      }
      await actionHandler({ ctx, args, prisma })
    },
    allowedUsers: ALLOWED_ADMINS
  },
  echo: {
    handler: async ({ ctx, args }) => {
      if (args.length === 0) {
        await ctx.send('Используйте: /echo <text>')
        return
      }
      await ctx.send(args.join(' '))
    }
    // allowedUsers не задан — команда доступна всем
  }
}