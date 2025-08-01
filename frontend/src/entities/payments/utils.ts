import type { Transaction } from './types'
import { declOfNum } from '@shared/utils'

export const getTransactionTypeLabel = (type: Transaction['type']): string => {
  switch (type) {
    case 'purchase':
      return 'Покупка'
    case 'gift':
      return 'Подарок'
    case 'refund':
      return 'Возврат'
    case 'bonus':
      return 'Бонус'
    case 'subscription':
      return 'Подписка'
    case 'adjustment':
      return 'Корректировка'
    default:
      return 'Транзакция'
  }
}

export const getTransactionStatusLabel = (status: Transaction['status']): string => {
  switch (status) {
    case 'completed':
      return 'Завершено'
    case 'pending':
      return 'В обработке'
    case 'failed':
      return 'Ошибка'
    case 'cancelled':
      return 'Отменено'
    default:
      return 'Неизвестно'
  }
}

export const getTransactionStatusColor = (status: Transaction['status']): string => {
  switch (status) {
    case 'completed':
      return 'var(--vkui--color_accent_positive)'
    case 'pending':
      return 'var(--vkui--color_accent_orange)'
    case 'failed':
    case 'cancelled':
      return 'var(--vkui--color_accent_negative)'
    default:
      return 'var(--vkui--color_text_secondary)'
  }
}

export const getTransactionAmountColor = (amount: number): string => {
  return amount > 0 
    ? 'var(--vkui--color_accent_positive)' 
    : 'var(--vkui--color_accent_negative)'
}

export const formatTransactionAmount = (amount: number): string => {
  return `${amount > 0 ? '+' : ''}${amount} ${declOfNum(amount, ['буст', 'буста', 'бустов'])}`
}

export const filterTransactionsByType = (
  transactions: Transaction[], 
  type: Transaction['type']
): Transaction[] => {
  return transactions.filter(t => t.type === type)
}

export const filterTransactionsByStatus = (
  transactions: Transaction[], 
  status: Transaction['status']
): Transaction[] => {
  return transactions.filter(t => t.status === status)
}

export const getCompletedTransactions = (transactions: Transaction[]): Transaction[] => {
  return filterTransactionsByStatus(transactions, 'completed')
}

export const getPurchaseTransactions = (transactions: Transaction[]): Transaction[] => {
  return filterTransactionsByType(transactions, 'purchase')
} 