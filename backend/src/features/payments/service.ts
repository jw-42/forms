import paymentsRepository from './repository'
import { ItemNotFoundError } from '@shared/utils/subscription-errors'
import { declOfNum } from '@shared/utils'

const SPECIAL_OFFERS: Record<string, { boostAmount: number; price: number; title?: string; description?: string }> = {
  'buy_bust_100': {
    boostAmount: 100,
    price: 75,
    title: 'Купить 100 бустов',
    description: 'Ещё больше бустов для твоих форм: генерируй описания, вопросы и подбирай формулировки.'
  }
}

function parseBoostAmount(itemId: string): number | null {
  const match = itemId.match(/^buy_bust_(\d+)$/)
  if (match && match[1]) {
    const amount = parseInt(match[1], 10)
    return amount > 0 ? amount : null
  }
  return null
}

function isBoostItem(itemId: string): boolean {
  return itemId.startsWith('buy_bust_')
}

function getItemConfig(itemId: string): { boostAmount: number; price: number; title?: string; description?: string } | null {
  if (SPECIAL_OFFERS[itemId]) {
    return SPECIAL_OFFERS[itemId]
  }

  const boostAmount = parseBoostAmount(itemId)
  if (!boostAmount) {
    return null
  }

  return {
    boostAmount,
    price: boostAmount
  }
}

function formatBoostTitle(boostAmount: number, customTitle?: string): string {
  if (customTitle) {
    return customTitle
  }

  return `Купить ${boostAmount} ${declOfNum(boostAmount, ['буст', 'буста', 'бустов'])}`
}

function formatBoostDescription(customDescription?: string): string {
  if (customDescription) {
    return customDescription
  }

  return 'Ещё больше бустов для твоих форм: генерируй описания, вопросы и подбирай формулировки.'
}

class PaymentsService {
  async getItemInfo(item: string) {
    if (!isBoostItem(item)) {
      throw new ItemNotFoundError(item)
    }

    const config = getItemConfig(item)
    if (!config) {
      throw new ItemNotFoundError(item)
    }

    const { boostAmount, price, title, description } = config
    
    return {
      item_id: item,
      title: formatBoostTitle(boostAmount, title),
      description: formatBoostDescription(description),
      price,
      boostAmount,
      expiration: 600
    }
  }

  async upsertTransaction(data: {
    external_id: string
    user_id: number
    type: 'purchase'|'gift'|'refund'|'bonus'|'subscription'|'adjustment'
    status: 'pending'|'completed'|'failed'|'cancelled'
    boosts_amount: number
    votes_amount: number
    description?: string
    metadata?: Record<string, any>
  }) {
    let transaction = await paymentsRepository.getTransactionByExternalId(data.external_id)
    
    if (!transaction) {
      transaction = await paymentsRepository.createTransaction(data)
    } else {
      await paymentsRepository.updateTransaction(transaction.id, {
        status: data.status,
        boosts_amount: data.boosts_amount,
        votes_amount: data.votes_amount,
        description: data.description,
        metadata: data.metadata
      })
    }
    
    return transaction
  }

  async processBoostPurchase(user_id: number, item_id: string) {
    if (!isBoostItem(item_id)) {
      throw new ItemNotFoundError(item_id)
    }

    const config = getItemConfig(item_id)
    if (!config) {
      throw new ItemNotFoundError(item_id)
    }

    const { boostAmount } = config

    await paymentsRepository.addUserBalance(user_id, boostAmount)
  }

  async getUserBalance(user_id: number) {
    return await paymentsRepository.getUserBalance(user_id)
  }

  async getUserTransactions(user_id: number) {
    return await paymentsRepository.getTransactionsByUserId(user_id)
  }
}

export default new PaymentsService() 