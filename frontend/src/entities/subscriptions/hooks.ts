import { useQuery } from '@tanstack/react-query'
import { subscriptionsKeys, getSubscriptions } from './api'

export const useGetSubscriptions = () => {
  return useQuery({
    queryKey: subscriptionsKeys.list(),
    queryFn: getSubscriptions,
  })
} 