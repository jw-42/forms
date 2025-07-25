import paymentsRepository from './repository'
import { ApiError } from '@shared/utils'

class PaymentsService {
  async getActiveSubscriptions(user_id: number) {
    if (!user_id) {
      throw ApiError.Unauthorized('User ID is required')
    }
    return await paymentsRepository.getSubscriptionByUserId(user_id)
  }
}

export default new PaymentsService() 