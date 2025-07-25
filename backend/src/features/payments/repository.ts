import { getPrisma } from '@infra/database'

interface CreateSubscriptionParams {
  subscription_id: number
  user_id: number
  status: 'chargeable'|'active'|'cancelled'
  cancel_reason?: 'user_decision'|'app_decision'|'payment_fail'|'unknown'
  item_id: string
  item_price: number
  next_bill_time: Date
  pending_cancel?: number
}

class PaymentsRepository {
  async createSubscription (data: CreateSubscriptionParams) {
    return await getPrisma().subscription.create({
      data
    })
  }

  async updateSubscription (subscription_id: number, data: Omit<CreateSubscriptionParams, 'subscription_id'|'user_id'>) {
    return await getPrisma().subscription.update({
      where: { subscription_id },
      data
    })
  }

  async getSubscriptionById (subscription_id: number) {
    return await getPrisma().subscription.findUnique({
      where: { subscription_id },
    })
  }

  async getSubscriptionByUserId (user_id: number, status?: ('active'|'chargeable'|'cancelled')[]) {
    return await getPrisma().subscription.findMany({
      where: { user_id, status: { in: status } },
      orderBy: { subscription_id: 'desc' }
    })
  }
}

export default new PaymentsRepository()