// Типы для платежного API

export interface BalanceInfo {
  balance: number
}

export interface Transaction {
  external_id: string
  type: 'purchase' | 'gift' | 'refund' | 'bonus' | 'subscription' | 'adjustment'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  boosts_amount: number
  votes_amount: number
  created_at: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
}

// Типы для VK платежей (из backend)
export interface GetItemParams {
  app_id: number
  item: string
  lang: 'ru_RU' | 'uk_UA' | 'be_BY' | 'en_US'
  notification_type: 'get_item' | 'get_item_test'
  order_id: number
  receiver_id: number
  user_id: number
  version?: string
  sig: string
  [key: string]: any // Разрешаем дополнительные поля
}

export interface OrderStatusChange {
  app_id: number
  item_id: string
  item_price: number
  notification_type: 'order_status_change_test' | 'order_status_change'
  status: 'chargeable' | 'refunded'
  order_id: number
  user_id: number
  version?: string
  sig: string
  [key: string]: any // Разрешаем дополнительные поля
} 