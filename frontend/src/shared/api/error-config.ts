import { errorService } from './error-handler'

// Configure error handling for different endpoints and status codes
export function configureErrorHandling() {

  errorService.configureErrorForMethod('/forms', 400, 'POST', {
    showModal: true,
    customTitle: 'Не удалось создать форму',
    customMessage: 'Возможно, вы заполнили не все поля или ввели некорректные значения.'
  })

  errorService.configureErrorForPatternAndMethod('/forms/:form_id', 404, 'GET', {
    showModal: true,
    customTitle: 'Форма не найдена',
    customMessage: 'Возможно, она была удалена или автор органичил доступ к ней.'
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