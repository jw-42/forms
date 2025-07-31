import { apiClient } from '@shared/api'

export interface BalanceInfo {
  balance: number
}

export const balanceApi = {
  getBalance: async (): Promise<BalanceInfo> => {
    return await apiClient.get<BalanceInfo>('/payments/balance')
  }
} 