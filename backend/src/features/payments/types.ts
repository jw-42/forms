import z from "zod";

export const GetSubscriptionParams = z.object({
  app_id: z.coerce.number(),
  item: z.string(),
  lang: z.enum(['ru_RU', 'uk_UA', 'be_BY', 'en_US']),
  notification_type: z.enum([
    'get_subscription',
    'get_subscription_test',
    'subscription_status_change',
    'subscription_status_change_test'
  ]),
  order_id: z.coerce.number(),
  receiver_id: z.coerce.number(),
  user_id: z.coerce.number(),
  version: z.string().optional(),
  sig: z.string()
})

export const ChangeSubscriptionStatus = z.object({
  app_id: z.coerce.number(),
  cancel_reason: z.enum([
    'user_decision',
    'app_decision',
    'payment_fail',
    'unknown'
  ]).optional(),
  item_id: z.string(),
  item_price: z.coerce.number(),
  notification_type: z.enum([
    'subscription_status_change_test',
    'subscription_status_change'
  ]),
  status: z.enum([
    'chargeable',
    'active',
    'cancelled'
  ]),
  next_bill_time: z.coerce.number().optional(),
  pending_cancel: z.coerce.number().optional(),
  subscription_id: z.coerce.number(),
  user_id: z.coerce.number(),
  version: z.string().optional(),
  sig: z.string()
})

// Новые типы для покупки бустов
export const GetItemParams = z.object({
  app_id: z.coerce.number(),
  item: z.string(),
  lang: z.enum(['ru_RU', 'uk_UA', 'be_BY', 'en_US']),
  notification_type: z.enum([
    'get_item',
    'get_item_test'
  ]),
  order_id: z.coerce.number(),
  receiver_id: z.coerce.number(),
  user_id: z.coerce.number(),
  version: z.string().optional(),
  sig: z.string()
})

export const OrderStatusChange = z.object({
  app_id: z.coerce.number(),
  item_id: z.string(),
  item_price: z.coerce.number(),
  notification_type: z.enum([
    'order_status_change_test',
    'order_status_change'
  ]),
  status: z.enum([
    'chargeable',
    'paid',
    'cancelled'
  ]),
  order_id: z.coerce.number(),
  user_id: z.coerce.number(),
  version: z.string().optional(),
  sig: z.string()
})

export type GetSubscriptionParams = z.infer<typeof GetSubscriptionParams>
export type ChangeSubscriptionStatus = z.infer<typeof ChangeSubscriptionStatus>
export type GetItemParams = z.infer<typeof GetItemParams>
export type OrderStatusChange = z.infer<typeof OrderStatusChange>