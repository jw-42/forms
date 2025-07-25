import paymentsRepository from './repository'
import { ApiError } from '@shared/utils'

class PaymentsService {
  async getActiveSubscriptions(user_id: number, status?: ('active'|'chargeable'|'cancelled')[]) {
    if (!user_id) {
      throw ApiError.Unauthorized('User ID is required')
    }
    return await paymentsRepository.getSubscriptionsByUserId(user_id, status)
  }
}

export default new PaymentsService() 