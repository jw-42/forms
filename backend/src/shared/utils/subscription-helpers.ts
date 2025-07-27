import type { Subscription } from '@prisma/client'
import { SUBSCRIPTION_PLANS, FREE_PLAN, type SubscriptionType } from '@shared/config/subscriptions'

export { type SubscriptionType } from '@shared/config/subscriptions'

export function hasActiveSubscription(subscriptions: Subscription[], subscriptionType: SubscriptionType): boolean {
  return subscriptions.some(sub => 
    sub.item_id === subscriptionType && 
    (sub.status === 'active' || sub.status === 'chargeable')
  )
}

export function hasAnyActiveSubscription(subscriptions: Subscription[]): boolean {
  return subscriptions.some(sub => 
    sub.status === 'active' || sub.status === 'chargeable'
  )
}

export function getActiveSubscriptionTypes(subscriptions: Subscription[]): SubscriptionType[] {
  const activeSubscriptions = subscriptions.filter(sub => 
    sub.status === 'active' || sub.status === 'chargeable'
  )
  
  return activeSubscriptions
    .map(sub => sub.item_id as SubscriptionType)
    .filter((type): type is SubscriptionType => 
      Object.keys(SUBSCRIPTION_PLANS).includes(type)
    )
}

export function hasFeatureAccess(subscriptions: Subscription[], featureId: string): boolean {
  // Логика проверки доступа к функциям на основе подписок
  const activeSubscriptions = subscriptions.filter(sub => 
    sub.status === 'active' || sub.status === 'chargeable'
  )
  
  // Здесь можно добавить логику проверки доступа к конкретным функциям
  // Пока что возвращаем true если есть любая активная подписка
  return activeSubscriptions.length > 0
}

export function getUserMaxForms(subscriptions: Subscription[]): number {
  const activeSubscriptions = subscriptions.filter(sub => 
    sub.status === 'active' || sub.status === 'chargeable'
  )
  
  // Проверяем подписки в порядке приоритета (premium > standard)
  for (const subscription of activeSubscriptions) {
    const plan = SUBSCRIPTION_PLANS[subscription.item_id as SubscriptionType]
    if (plan) {
      return plan.limits.maxForms
    }
  }
  
  return FREE_PLAN.limits.maxForms
}

export function getUserMaxQuestionsPerForm(subscriptions: Subscription[]): number {
  const activeSubscriptions = subscriptions.filter(sub => 
    sub.status === 'active' || sub.status === 'chargeable'
  )
  
  // Проверяем подписки в порядке приоритета (premium > standard)
  for (const subscription of activeSubscriptions) {
    const plan = SUBSCRIPTION_PLANS[subscription.item_id as SubscriptionType]
    if (plan) {
      return plan.limits.maxQuestionsPerForm
    }
  }
  
  return FREE_PLAN.limits.maxQuestionsPerForm
}

export function canCreateForm(subscriptions: Subscription[], currentCount: number): boolean {
  const maxForms = getUserMaxForms(subscriptions)
  return currentCount < maxForms
}

export function canAddQuestion(subscriptions: Subscription[], currentCount: number): boolean {
  const maxQuestionsPerForm = getUserMaxQuestionsPerForm(subscriptions)
  return currentCount < maxQuestionsPerForm
} 