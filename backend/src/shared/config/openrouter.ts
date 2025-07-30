export const openRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseUrl: 'https://openrouter.ai/api/v1',
  model: 'deepseek/deepseek-chat-v3-0324:free',
  headers: {
    'HTTP-Referer': 'https://vk.com/app52507907',
    'X-Title': 'VK Forms Generator'
  }
}