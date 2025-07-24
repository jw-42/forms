import z from "zod";

export const GetSubscriptionParams = z.object({
  app_id: z.coerce.number(),
  item: z.string(),
  lang: z.enum(['ru_RU', 'uk_UA', 'be_BY', 'en_US']),
  notification_type: z.enum([
    'get_subscription',
    'get_subscription_test'
  ]),
  order_id: z.coerce.number(),
  receiver_id: z.coerce.number(),
  user_id: z.coerce.number(),
  version: z.string().optional(),
  sig: z.string()
})

export type GetSubscriptionParams = z.infer<typeof GetSubscriptionParams>