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

  async generateQuestionDescription(questionText: string, questionType: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured')
    }

    const systemPrompt = `Ты помощник для создания форм и опросов в VK Mini App. 
Твоя задача - генерировать краткие и понятные описания для вопросов формы на основе текста вопроса.
Описание должно быть на русском языке, длиной от 20 до 100 символов.
Описание должно пояснять, какой ответ ожидается от пользователя.`

    const userPrompt = `Сгенерируй описание для вопроса формы:
Текст вопроса: "${questionText}"
Тип вопроса: ${this.getQuestionTypeDescription(questionType)}

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

      const description = data.choices[0].message.content.trim()
      
      // Ensure description is within length limits
      if (description.length < 20 || description.length > 100) {
        return this.fallbackDescription(questionType)
      }

      return description
    } catch (error) {
      console.error('OpenRouter API error:', error)
      return this.fallbackDescription(questionType)
    }
  }

  private getQuestionTypeDescription(type: string): string {
    switch (type) {
      case 'text':
        return 'текст (короткий ответ)'
      case 'long_text':
        return 'текст (развернутый ответ)'
      case 'radio':
        return 'выбор одного варианта из списка'
      default:
        return 'текстовый ответ'
    }
  }

  private fallbackDescription(type: string): string {
    switch (type) {
      case 'text':
        return 'Введите короткий текстовый ответ'
      case 'long_text':
        return 'Введите развернутый текстовый ответ'
      case 'radio':
        return 'Выберите один вариант из предложенных'
      default:
        return 'Введите ваш ответ'
    }
  }
}

export const openRouterClient = new OpenRouterClient()