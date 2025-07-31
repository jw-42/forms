import z from "zod";

// Типы для покупки бустов
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
}).passthrough() // Разрешаем дополнительные поля

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
    'refunded'
  ]),
  order_id: z.coerce.number(),
  user_id: z.coerce.number(),
  version: z.string().optional(),
  sig: z.string()
}).passthrough() // Разрешаем дополнительные поля

export type GetItemParams = z.infer<typeof GetItemParams>
export type OrderStatusChange = z.infer<typeof OrderStatusChange>