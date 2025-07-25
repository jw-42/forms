export type SubscriptionStatus = 'chargeable' | 'active' | 'cancelled'
export type SubscriptionCancelReason = 'user_decision' | 'app_decision' | 'payment_fail' | 'unknown'

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  chargeable: 'Ожидает оплаты',
  active: 'Активна',
  cancelled: 'Отменена',
}

export const SUBSCRIPTION_CANCEL_REASON_LABELS: Record<SubscriptionCancelReason, string> = {
  user_decision: 'Пользователь',
  app_decision: 'Приложение',
  payment_fail: 'Платёж',
  unknown: 'Неизвестно',
}

export interface Subscription {
  subscription_id: number;
  user_id: number;
  status: SubscriptionStatus;
  cancel_reason?: SubscriptionCancelReason;
  item_id: string;
  item_price: number;
  next_bill_time: string; // DateTime as ISO string
  pending_cancel?: number;
}

export type GetSubscriptionsResponse = Subscription[]; 