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
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@shared/config/subscriptions'
import { SubscriptionNotFoundError } from '@shared/utils/subscription-errors'

class PaymentsService {
  // Методы для работы с подписками
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
  async getSubscriptionInfo(item: string): Promise<SubscriptionPlan & { expiration: number }> {
    const plan = SUBSCRIPTION_PLANS[item as SubscriptionType]
    
    if (!plan) {
      throw new SubscriptionNotFoundError(item)
    }
    
    return {
      ...plan,
      expiration: 600 // 10 минут в секундах
    }
  }
}

export default new PaymentsService() 