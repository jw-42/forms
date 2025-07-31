import { useQuery } from '@tanstack/react-query'
import { balanceApi } from './api'

export const useGetBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: balanceApi.getBalance,
    staleTime: 0, // Данные считаются устаревшими сразу
  })
} 