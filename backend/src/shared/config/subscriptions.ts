export type SubscriptionType = 'standard_30' | 'premium_30'

export interface SubscriptionPlan {
  id: SubscriptionType
  name: string
  description: string
  price: number
  period: number
  trial_period?: number
  limits: {
    maxForms: number
    maxQuestionsPerForm: number
  }
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionType, SubscriptionPlan> = {
  standard_30: {
    id: 'standard_30',
    name: 'Стандарт',
    description: 'Создавайте анкеты в пару кликов и получите доступ к продвинутым функциям!',
    price: 20,
    period: 30,
    trial_period: 3,
    limits: {
      maxForms: 5,
      maxQuestionsPerForm: 10
    }
  },
  premium_30: {
    id: 'premium_30',
    name: 'Премиум',
    description: 'Создавайте анкеты в пару кликов, получите доступ к продвинутой аналитике и интеграции с CRM.',
    price: 30,
    period: 30,
    limits: {
      maxForms: 1000,
      maxQuestionsPerForm: 50
    }
  }
}

// Бесплатный план (по умолчанию)
export const FREE_PLAN: Omit<SubscriptionPlan, 'id'> = {
  name: 'Бесплатно',
  description: 'Базовые возможности для создания форм',
  price: 0,
  period: 0,
  limits: {
    maxForms: 1,
    maxQuestionsPerForm: 5
  }
}

export function getPlanLimits(subscriptionType: SubscriptionType) {
  return SUBSCRIPTION_PLANS[subscriptionType].limits
}

export function getFreePlanLimits() {
  return FREE_PLAN.limits
} 