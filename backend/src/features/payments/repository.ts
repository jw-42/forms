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

interface CreateOrderParams {
  order_id: number
  user_id: number
  status: 'chargeable'|'refunded'
  item_id: string
  item_price: number
}

class PaymentsRepository {
  // Методы для работы с подписками
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

  async getSubscriptionsByUserId (user_id: number, status?: ('active'|'chargeable'|'cancelled')[]) {
    return await getPrisma().subscription.findMany({
      where: { user_id, status: { in: status } },
      orderBy: { subscription_id: 'desc' }
    })
  }

  // Методы для работы с заказами
  async createOrder (data: CreateOrderParams) {
    return await getPrisma().order.create({
      data: {
        order_id: data.order_id,
        user_id: data.user_id,
        status: data.status,
        item_id: data.item_id,
        item_price: data.item_price,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  }

  async updateOrder (order_id: number, data: Omit<CreateOrderParams, 'order_id'|'user_id'>) {
    return await getPrisma().order.update({
      where: { order_id },
      data: {
        ...data,
        updated_at: new Date()
      }
    })
  }

  async getOrderById (order_id: number) {
    return await getPrisma().order.findUnique({
      where: { order_id },
    })
  }

  async getOrdersByUserId (user_id: number, status?: ('chargeable'|'refunded')[]) {
    return await getPrisma().order.findMany({
      where: { user_id, status: { in: status } },
      orderBy: { order_id: 'desc' }
    })
  }

  // Методы для работы с балансом пользователей
  async addUserBalance (user_id: number, amount: number) {
    return await getPrisma().user.update({
      where: { id: user_id },
      data: {
        balance: {
          increment: amount
        }
      }
    })
  }

  async getUserBalance (user_id: number) {
    const user = await getPrisma().user.findUnique({
      where: { id: user_id },
      select: { balance: true }
    })
    return user?.balance || 0
  }

  // Методы для работы с формами (для проверки лимитов)
  async getUserFormsCount (user_id: number): Promise<number> {
    return await getPrisma().form.count({
      where: { owner_id: user_id }
    })
  }

  // Методы для работы с вопросами (для проверки лимитов)
  async getFormQuestionsCount (form_id: string): Promise<number> {
    return await getPrisma().question.count({
      where: { form_id }
    })
  }
}

export default new PaymentsRepository()