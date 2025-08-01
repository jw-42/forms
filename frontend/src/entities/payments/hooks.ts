import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from './api'

export const useGetBalance = () => {
  return useQuery({
    queryKey: ['payments', 'balance'],
    queryFn: paymentsApi.getBalance,
    staleTime: 3 * 1000,
  })
}

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['payments', 'transactions'],
    queryFn: paymentsApi.getTransactions,
    staleTime: 15 * 1000,
  })
} 