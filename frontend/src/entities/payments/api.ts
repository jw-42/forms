import { apiClient } from '@shared/api'
import type { BalanceInfo, TransactionsResponse } from './types'

export const paymentKeys = {
  all: ['payments'] as const,
  balance: () => [...paymentKeys.all, 'balance'] as const,
  transactions: () => [...paymentKeys.all, 'transactions'] as const,
  transaction: (id: string) => [...paymentKeys.transactions(), id] as const,
}

export const paymentsApi = {
  getBalance: async (): Promise<BalanceInfo> => {
    return await apiClient.get<BalanceInfo>('/payments/balance')
  },

  getTransactions: async (): Promise<TransactionsResponse> => {
    return await apiClient.get<TransactionsResponse>('/payments/transactions')
  }
} 