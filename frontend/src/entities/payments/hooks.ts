import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from './api'

export const useGetBalance = () => {
  return useQuery({
    queryKey: ['payments', 'balance'],
    queryFn: paymentsApi.getBalance,
    staleTime: 0, // Данные считаются устаревшими сразу
  })
}

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['payments', 'transactions'],
    queryFn: paymentsApi.getTransactions,
    staleTime: 5 * 60 * 1000, // 5 минут
  })
} 