export interface Subscription {
  subscription_id: number;
  user_id: number;
  status: 'chargeable' | 'active' | 'cancelled';
  cancel_reason?: 'user_decision' | 'app_decision' | 'payment_fail' | 'unknown';
  item_id: string;
  item_price: number;
  next_bill_time: string; // DateTime as ISO string
  pending_cancel?: number;
}

export type GetSubscriptionsResponse = Subscription[]; 