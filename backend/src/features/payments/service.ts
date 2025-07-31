import paymentsRepository from './repository'
import { 
  hasActiveSubscription, 
  hasAnyActiveSubscription, 
  getActiveSubscriptionTypes, 
  hasFeatureAccess,
  getUserMaxForms,
  getUserMaxQuestionsPerForm,
  canCreateForm,
  canAddQuestion,
  type SubscriptionType
} from '@shared/utils/subscription-helpers'
import { SUBSCRIPTION_PLANS } from '@shared/config/subscriptions'
import { SubscriptionNotFoundError, ItemNotFoundError } from '@shared/utils/subscription-errors'
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

  return `${boostAmount} ${declOfNum(boostAmount, ['буст', 'буста', 'бустов'])}`
}

function formatBoostDescription(customDescription?: string): string {
  if (customDescription) {
    return customDescription
  }

  return 'Ещё больше бустов для твоих форм: генерируй описания, вопросы и подбирай формулировки.'
}

class PaymentsService {
  async getActiveSubscriptions(user_id: number, status?: ('active'|'chargeable'|'cancelled')[]) {
    return await paymentsRepository.getSubscriptionsByUserId(user_id, status)
  }

  async hasActiveSubscription(user_id: number, subscriptionType: 'standard_30' | 'premium_30'): Promise<boolean> {
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    return hasActiveSubscription(subscriptions, subscriptionType)
  }

  async hasAnyActiveSubscription(user_id: number): Promise<boolean> {
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    return hasAnyActiveSubscription(subscriptions)
  }

  async getActiveSubscriptionTypes(user_id: number): Promise<('standard_30' | 'premium_30')[]> {
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    return getActiveSubscriptionTypes(subscriptions)
  }

  async hasFeatureAccess(user_id: number, featureId: string): Promise<boolean> {
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    return hasFeatureAccess(subscriptions, featureId)
  }

  // Методы для получения лимитов
  async getUserMaxForms(user_id: number): Promise<number> {
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    return getUserMaxForms(subscriptions)
  }

  async getUserMaxQuestionsPerForm(user_id: number): Promise<number> {
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    return getUserMaxQuestionsPerForm(subscriptions)
  }

  // Методы для проверки возможности выполнения действий
  async canCreateForm(user_id: number): Promise<{ canCreate: boolean; currentCount: number; maxCount: number }> {
    const currentFormsCount = await paymentsRepository.getUserFormsCount(user_id)
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    const canCreate = canCreateForm(subscriptions, currentFormsCount)
    const maxForms = getUserMaxForms(subscriptions)
    
    return {
      canCreate,
      currentCount: currentFormsCount,
      maxCount: maxForms
    }
  }

  async canAddQuestion(user_id: number, formId: string): Promise<{ canAdd: boolean; currentCount: number; maxCount: number }> {
    const currentQuestionsCount = await paymentsRepository.getFormQuestionsCount(formId)
    const subscriptions = await this.getActiveSubscriptions(user_id, ['active', 'chargeable'])
    const canAdd = canAddQuestion(subscriptions, currentQuestionsCount)
    const maxQuestionsPerForm = getUserMaxQuestionsPerForm(subscriptions)
    
    return {
      canAdd,
      currentCount: currentQuestionsCount,
      maxCount: maxQuestionsPerForm
    }
  }

  // Методы для работы с подписками (из API)
  async createOrUpdateSubscription(data: {
    subscription_id: number
    user_id: number
    status: 'chargeable'|'active'|'cancelled'
    cancel_reason?: 'user_decision'|'app_decision'|'payment_fail'|'unknown'
    item_id: string
    item_price: number
    next_bill_time: Date
    pending_cancel?: number
  }) {
    let subscription = await paymentsRepository.getSubscriptionById(data.subscription_id)
    
    if (!subscription) {
      subscription = await paymentsRepository.createSubscription(data)
    } else {
      await paymentsRepository.updateSubscription(data.subscription_id, {
        status: data.status,
        cancel_reason: data.cancel_reason,
        item_id: data.item_id,
        item_price: data.item_price,
        next_bill_time: data.next_bill_time,
        pending_cancel: data.pending_cancel
      })
    }
    
    return subscription
  }

  // Методы для получения информации о подписке
  async getSubscriptionInfo(item: string): Promise<{
    item_id: string
    title: string
    description: string
    period: number
    price: number
    expiration: number
  }> {
    const plan = SUBSCRIPTION_PLANS[item as SubscriptionType]
    
    if (!plan) {
      throw new SubscriptionNotFoundError(item)
    }
    
    return {
      item_id: plan.id,
      title: plan.name,
      description: plan.description,
      period: plan.period,
      price: plan.price,
      expiration: 600 // 10 минут в секундах
    }
  }

  // Методы для работы с товарами (бустами)
  async getItemInfo(item: string): Promise<{
    item_id: string
    title: string
    description: string
    price: number
    boostAmount: number
    expiration: number
  }> {
    // Проверяем, является ли товар бустом
    if (!isBoostItem(item)) {
      throw new ItemNotFoundError(item)
    }

    // Получаем конфигурацию товара
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
      expiration: 600 // 10 минут в секундах
    }
  }

  // Методы для обработки заказов бустов
  async createOrUpdateOrder(data: {
    order_id: number
    user_id: number
    status: 'chargeable'|'paid'|'cancelled'
    item_id: string
    item_price: number
  }) {
    let order = await paymentsRepository.getOrderById(data.order_id)
    
    if (!order) {
      order = await paymentsRepository.createOrder(data)
    } else {
      await paymentsRepository.updateOrder(data.order_id, {
        status: data.status,
        item_id: data.item_id,
        item_price: data.item_price
      })
    }
    
    return order
  }

  // Метод для обработки успешной оплаты бустов
  async processBoostPurchase(order_id: number, user_id: number, item_id: string) {
    // Проверяем, является ли товар бустом
    if (!isBoostItem(item_id)) {
      throw new ItemNotFoundError(item_id)
    }

    // Получаем конфигурацию товара
    const config = getItemConfig(item_id)
    if (!config) {
      throw new ItemNotFoundError(item_id)
    }

    const { boostAmount, price } = config

    // Обновляем баланс пользователя
    await paymentsRepository.addUserBalance(user_id, boostAmount)
    
    // Обновляем статус заказа
    await paymentsRepository.updateOrder(order_id, {
      status: 'paid',
      item_id,
      item_price: price
    })
  }
}

export default new PaymentsService() 