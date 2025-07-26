import { useQuery } from '@tanstack/react-query'
import { queryClient } from '@shared/api'
import { subscriptionsKeys, getSubscriptions, invalidateSubscriptions } from './api'

export const useGetSubscriptions = () => {
  return useQuery({
    queryKey: subscriptionsKeys.list(),
    queryFn: getSubscriptions,
    staleTime: 15000,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 15000
  })
}

export const useRefreshSubscriptions = () => {
  return () => {
    return queryClient.invalidateQueries({
      queryKey: subscriptionsKeys.all
    })
  }
}

export { invalidateSubscriptions } 