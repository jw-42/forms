import { Icon48StarsCircleFillViolet } from '@vkontakte/icons'
import { errorService } from './error-handler'
import React from 'react'
import { Button } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { routes } from '@shared/index'

// Configure error handling for different endpoints and status codes
export function configureErrorHandling() {

  // Кастомная иконка с размерами
  const CustomLimitIcon = () => <Icon48StarsCircleFillViolet width={56} height={56} />

  // Компонент кнопки с переходом на подписку
  const SubscriptionButton = () => {
    const router = useRouteNavigator()
    
    const handleSubscriptionClick = () => {
      router.push(routes.subscription.overview.path)
    }
    
    return (
      <Button size="l" mode="primary" onClick={handleSubscriptionClick}>
        Оформить подписку
      </Button>
    )
  }

  errorService.configureErrorForMethod('/forms', 400, 'POST', {
    showModal: true,
    customTitle: 'Не удалось создать форму',
    customMessage: 'Возможно, вы заполнили не все поля или ввели некорректные значения.'
  })

  errorService.configureErrorForMethod('/forms', 409, 'POST', {
    showModal: true,
    customTitle: 'Достигнут лимит',
    customIcon: CustomLimitIcon,
    customPlaceholderTitle: 'Создавай больше с подпиской',
    customMessage: 'Генерируй описание анкет и новые вопросы в один клик, а также получи доступ к детальной статистике и другим возможностям.',
    customPlaceholderAction: <SubscriptionButton />
  })

  errorService.configureErrorForPatternAndMethod('/forms/:form_id', 404, 'GET', {
    showModal: true,
    customTitle: 'Форма не найдена',
    customMessage: 'Возможно, она была удалена или автор органичил доступ к ней.'
  })

  errorService.configureErrorForPatternAndMethod('/forms/:form_id/questions', 409, 'POST', {
    showModal: true,
    customTitle: 'Достигнут лимит',
    customIcon: CustomLimitIcon,
    customPlaceholderTitle: 'Создавай больше с подпиской',
    customMessage: 'Генерируй описание анкет и новые вопросы в один клик, а также получи доступ к детальной статистике и другим возможностям.',
    customPlaceholderAction: <SubscriptionButton />
  })
  
  errorService.configureErrorForStatus(401, { showModal: false })
  
  errorService.configureErrorForStatus(500, {
    showModal: true,
    customTitle: 'Внутренняя ошибка',
    customMessage: 'Похоже, что-то пошло не так. Попробуйте позже или обратитесь в поддержку.'
  })

}

// Helper functions for common configurations
export const ErrorConfigHelpers = {
  // Configure silent errors (no modal)
  silent: (endpoint: string, status: number) => {
    errorService.configureError(endpoint, status, { showModal: false })
  },

  // Configure silent errors for all endpoints with specific status
  silentForStatus: (status: number) => {
    errorService.configureErrorForStatus(status, { showModal: false })
  },

  // Configure custom error messages
  custom: (endpoint: string, status: number, title: string, message: string) => {
    errorService.configureError(endpoint, status, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  },

  // Configure custom error for all endpoints with specific status
  customForStatus: (status: number, title: string, message: string) => {
    errorService.configureErrorForStatus(status, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  },

  // Configure silent errors for pattern-based endpoints
  silentPattern: (pattern: string, status: number) => {
    errorService.configureErrorForPattern(pattern, status, { showModal: false })
  },

  // Configure custom error messages for pattern-based endpoints
  customPattern: (pattern: string, status: number, title: string, message: string) => {
    errorService.configureErrorForPattern(pattern, status, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  },

  // Configure silent errors for pattern-based endpoints with any status
  silentPatternAnyStatus: (pattern: string) => {
    errorService.configureErrorForPatternAnyStatus(pattern, { showModal: false })
  },

  // Configure silent errors for specific method
  silentForMethod: (endpoint: string, status: number, method: string) => {
    errorService.configureErrorForMethod(endpoint, status, method, { showModal: false })
  },

  // Configure silent errors for all endpoints with specific status and method
  silentForStatusAndMethod: (status: number, method: string) => {
    errorService.configureErrorForStatusAndMethod(status, method, { showModal: false })
  },

  // Configure custom error messages for specific method
  customForMethod: (endpoint: string, status: number, method: string, title: string, message: string) => {
    errorService.configureErrorForMethod(endpoint, status, method, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  },

  // Configure custom error for all endpoints with specific status and method
  customForStatusAndMethod: (status: number, method: string, title: string, message: string) => {
    errorService.configureErrorForStatusAndMethod(status, method, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  },

  // Configure silent errors for pattern-based endpoints with specific method
  silentPatternForMethod: (pattern: string, status: number, method: string) => {
    errorService.configureErrorForPatternAndMethod(pattern, status, method, { showModal: false })
  },

  // Configure silent errors for pattern-based endpoints with any status and specific method
  silentPatternForMethodAnyStatus: (pattern: string, method: string) => {
    errorService.configureErrorForPatternAndMethodAnyStatus(pattern, method, { showModal: false })
  },

  // Configure custom error messages for pattern-based endpoints with specific method
  customPatternForMethod: (pattern: string, status: number, method: string, title: string, message: string) => {
    errorService.configureErrorForPatternAndMethod(pattern, status, method, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  },

  // Configure custom error for pattern-based endpoints with any status and specific method
  customPatternForMethodAnyStatus: (pattern: string, method: string, title: string, message: string) => {
    errorService.configureErrorForPatternAndMethodAnyStatus(pattern, method, {
      showModal: true,
      customTitle: title,
      customMessage: message
    })
  }
} 