import { apiClient } from '@shared/api'
import { GetSubscriptionsResponse } from './types'

export const subscriptionsKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionsKeys.all, 'list'] as const,
  list: () => [...subscriptionsKeys.lists()] as const,
}

export const getSubscriptions = async (): Promise<GetSubscriptionsResponse> => {
  return await apiClient.get('/payments/active')
} 