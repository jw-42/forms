import { openRouterConfig } from '@shared/config'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  id: string
  model: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
}

export class OpenRouterClient {
  private baseUrl: string
  private apiKey: string
  private model: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = openRouterConfig.baseUrl
    this.apiKey = openRouterConfig.apiKey
    this.model = openRouterConfig.model
    this.headers = openRouterConfig.headers
  }

  async generateFormDescription(formTitle: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured')
    }

    const systemPrompt = `Ты помощник для создания форм и опросов в VK Mini App. 
Твоя задача - генерировать краткие и понятные описания для анкет на основе их названий.
Чаще всего ты пишешь описание для анкет владельцев сообществ, бизнеса и организаторов мероприятий.
Твоя задача - определить цель анкеты (сбор заявок, регистрация на мероприятие, опрос, сбор обратной связи и т.д.)
и сгенерировать подходящее описание, которое расскажет пользователю об анкете и её назначении.
Описание должно быть "продающим" и мотивирующим к заполнению, если это уместно.
Описание должно быть на русском языке, длиной от 10 до 256 символов.`

    const userPrompt = `Сгенерируй описание для анкеты на основе её названия:
Название анкеты: "${formTitle}"
Ответь только описанием, без дополнительного текста.`

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...this.headers
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 150
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json() as ChatCompletionResponse
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter API')
      }

      const content = data.choices[0]?.message?.content?.trim()
      if (!content) {
        throw new Error('Invalid response format from OpenRouter API')
      }

      const description = content.trim()
      
      // Ensure description is within length limits
      if (description.length < 10 || description.length > 256) {
        console.error('Description length is not within limits', description)
        return this.fallbackFormDescription()
      }

      return description
    } catch (error) {
      console.error('OpenRouter API error:', error)
      return this.fallbackFormDescription()
    }
  }

  private fallbackFormDescription(): string {
    return 'Заполните анкету для участия в мероприятии'
  }
}

let _openRouterClient: OpenRouterClient | null = null

export const openRouterClient = () => {
  if (!_openRouterClient) {
    _openRouterClient = new OpenRouterClient()
  }
  return _openRouterClient
}