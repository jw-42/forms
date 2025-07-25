import { useQuery } from '@tanstack/react-query'
import { subscriptionsKeys, getSubscriptions } from './api'

export const useGetSubscriptions = () => {
  return useQuery({
    queryKey: subscriptionsKeys.list(),
    queryFn: getSubscriptions,
    staleTime: 30000, // данные свежие 30 секунд
    gcTime: 2 * 60 * 1000, // живут в кэше 2 минуты
  })
} 