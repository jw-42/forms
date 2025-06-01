import z from 'zod'

export const launchParamsSchema = z.object({
  sign: z.string().optional(),
  vk_app_id: z.number().int().optional(),
  vk_chat_id: z.string().optional(),
  vk_group_id: z.number().int().optional(),
  vk_access_token_settings: z.string().optional(),
  vk_has_profile_button: z.number().int().optional(),
  vk_is_app_user: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  vk_are_notifications_enabled: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  vk_is_favorite: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  vk_is_recommended: z.number().int().refine((val) => val === 0 || val === 1).optional(),
  vk_language: z.string().refine((val) => [
    'ru','uk','ua','en','be','kz','pt','es'
  ].includes(val)).optional(),
  vk_platform: z.string().refine((val) => [
    'desktop_web','mobile_android','mobile_ipad','mobile_iphone','mobile_web',
    'desktop_app_messenger','desktop_web_messenger','mobile_android_messenger',
    'mobile_iphone_messenger','android_external','iphone_external',
    'ipad_external','mvk_external','web_external'
  ].includes(val)).optional(),
  vk_profile_id: z.number().int().optional(),
  vk_ref: z.string().optional(),
  vk_testing_group_id: z.number().int().optional(),
  vk_ts: z.number().int().optional(),
  vk_user_id: z.number().int().optional(),
  vk_viewer_group_role: z.string().refine((val) => [
    'admin','editor','member','moder','none'
  ].includes(val)).optional(),
})

export type LaunchParams = z.infer<typeof launchParamsSchema>