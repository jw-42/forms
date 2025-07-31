import { getPrisma } from '@infra/database'

interface CreateTransactionParams {
  external_id: string
  user_id: number
  type: 'purchase'|'gift'|'refund'|'bonus'|'subscription'|'adjustment'
  status: 'pending'|'completed'|'failed'|'cancelled'
  boosts_amount: number
  votes_amount: number
  description?: string
  metadata?: Record<string, any>
}

class PaymentsRepository {
  async createTransaction(data: CreateTransactionParams) {
    return await getPrisma().transaction.create({
      data: {
        external_id: data.external_id,
        user_id: data.user_id,
        type: data.type,
        status: data.status,
        boosts_amount: data.boosts_amount,
        votes_amount: data.votes_amount,
        description: data.description,
        metadata: data.metadata,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  }

  async updateTransaction(transaction_id: string, data: Omit<CreateTransactionParams, 'external_id'|'user_id'|'type'>) {
    return await getPrisma().transaction.update({
      where: { id: transaction_id },
      data: {
        ...data,
        updated_at: new Date()
      }
    })
  }

  async getTransactionByExternalId(external_id: string) {
    return await getPrisma().transaction.findUnique({
      where: { external_id },
    })
  }

  async getTransactionsByUserId(user_id: number, status?: ('pending'|'completed'|'failed'|'cancelled')[]) {
    return await getPrisma().transaction.findMany({
      where: { user_id, status: { in: status } },
      select: {
        external_id: true,
        type: true,
        status: true,
        boosts_amount: true,
        votes_amount: true,
        created_at: true
      },
      take: 10,
      orderBy: { created_at: 'desc' }
    })
  }

  async addUserBalance(user_id: number, amount: number) {
    return await getPrisma().user.update({
      where: { id: user_id },
      data: {
        balance: {
          increment: amount
        }
      }
    })
  }

  async getUserBalance(user_id: number) {
    const user = await getPrisma().user.findUnique({
      where: { id: user_id },
      select: { balance: true }
    })
    return user?.balance || 0
  }
}

export default new PaymentsRepository()