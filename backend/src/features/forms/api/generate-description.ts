import type { Context, Next } from 'hono'
import { createFactory } from 'hono/factory'
import { ApiError } from '@shared/utils'
import { formsService } from '..'
import { openRouterClient } from '@infra/openrouter'
import { z } from 'zod'
import paymentsService from '@features/payments/service'

const factory = createFactory()

const DESCRIPTION_GENERATION_COST = 1

const generateDescriptionSchema = z.object({
  form_title: z.string().min(3).max(100)
})

export const generateDescription = factory.createHandlers(async (ctx: Context, next: Next) => {
  const user_id = ctx.get('uid') as number
  let transaction_id: string | null = null

  try {
    const body = await ctx.req.json()
    const result = generateDescriptionSchema.safeParse(body)

    if (!result.success) {
      throw ApiError.BadRequest(
        'Invalid request parameters',
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }

    const { form_title } = result.data

    // Проверяем баланс пользователя
    const userBalance = await paymentsService.getUserBalance(user_id)
    
    if (userBalance < DESCRIPTION_GENERATION_COST) {
      throw ApiError.BadRequest('Недостаточно средств для генерации описания')
    }

    await paymentsService.subtractUserBalance(user_id, DESCRIPTION_GENERATION_COST)

    const transaction = await paymentsService.upsertTransaction({
      external_id: `desc_gen_${Date.now()}_${user_id}`,
      user_id,
      type: 'purchase',
      status: 'completed',
      boosts_amount: -DESCRIPTION_GENERATION_COST,
      votes_amount: 0,
      description: 'Генерация описания формы',
      metadata: {
        form_title,
        generation_type: 'description'
      }
    })

    transaction_id = transaction.id

    const description = await openRouterClient().generateFormDescription(form_title)

    return ctx.json({
      description,
      generated: true
    })

  } catch (error) {
    if (transaction_id && error instanceof ApiError && error.status !== 400) {
      try {
        await paymentsService.addUserBalance(user_id, DESCRIPTION_GENERATION_COST)
        
        await paymentsService.upsertTransaction({
          external_id: `desc_gen_refund_${Date.now()}_${user_id}`,
          user_id,
          type: 'refund',
          status: 'completed',
          boosts_amount: DESCRIPTION_GENERATION_COST,
          votes_amount: 0,
          description: 'Возврат средств за неудачную генерацию описания',
          metadata: {
            original_transaction_id: transaction_id,
            generation_type: 'description'
          }
        })
      } catch (refundError) {
        console.error('Failed to refund user balance:', refundError)
      }
    }

    if (error instanceof ApiError) {
      throw error
    } else {
      console.error('Generate description error:', error)
      throw ApiError.Internal('Failed to generate description')
    }
  }
})