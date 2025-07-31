import { apiClient } from '@shared/api'

export interface BalanceInfo {
  balance: number
}

export const balanceApi = {
  getBalance: () => 
    apiClient.get<BalanceInfo>('/payments/balance').then(res => res.data),
} 