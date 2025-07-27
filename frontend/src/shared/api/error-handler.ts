import React from 'react'
import { Icon56CancelCircleOutline, Icon56GhostOutline, Icon56GlobeCrossOutline, Icon56KeyOutline, Icon56LockOutline } from '@vkontakte/icons'

// Error configuration interface
export interface ErrorConfig {
  showModal: boolean
  customMessage?: string
  customTitle?: string
  customPlaceholderTitle?: string
  customPlaceholderAction?: React.ReactNode
  customIcon?: React.ComponentType
  method?: string // HTTP method (GET, POST, PUT, DELETE, etc.)
}

// Global error handler
export class ErrorService {
  private static instance: ErrorService
  private showErrorModal?: ((title: string, message: string, icon?: React.ComponentType, placeholderTitle?: string, placeholderAction?: React.ReactNode) => void) | undefined
  private errorConfigs: Map<string, ErrorConfig> = new Map()
  private patternConfigs: Array<{ pattern: RegExp, status: number, config: ErrorConfig, method?: string }> = []

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  setErrorModal(showErrorModal: ((title: string, message: string, icon?: React.ComponentType, placeholderTitle?: string, placeholderAction?: React.ReactNode) => void) | undefined) {
    this.showErrorModal = showErrorModal
  }

  // Configure error handling for specific endpoints and status codes
  configureError(endpoint: string, status: number, config: ErrorConfig) {
    const key = `${endpoint}:${status}`
    this.errorConfigs.set(key, config)
  }

  // Configure error handling for specific endpoint, status and method
  configureErrorForMethod(endpoint: string, status: number, method: string, config: ErrorConfig) {
    const key = `${endpoint}:${status}:${method.toUpperCase()}`
    this.errorConfigs.set(key, config)
  }

  // Configure error handling for all endpoints with specific status
  configureErrorForStatus(status: number, config: ErrorConfig) {
    this.errorConfigs.set(`*:${status}`, config)
  }

  // Configure error handling for all endpoints with specific status and method
  configureErrorForStatusAndMethod(status: number, method: string, config: ErrorConfig) {
    this.errorConfigs.set(`*:${status}:${method.toUpperCase()}`, config)
  }

  // Configure error handling for specific endpoint with any status
  configureErrorForEndpoint(endpoint: string, config: ErrorConfig) {
    this.errorConfigs.set(`${endpoint}:*`, config)
  }

  // Configure error handling for specific endpoint and method with any status
  configureErrorForEndpointAndMethod(endpoint: string, method: string, config: ErrorConfig) {
    this.errorConfigs.set(`${endpoint}:*:${method.toUpperCase()}`, config)
  }

  // Configure error handling for pattern-based endpoints
  configureErrorForPattern(pattern: string, status: number, config: ErrorConfig) {
    // Convert pattern like "/forms/:form_id/q/:question_id" to regex
    const regexPattern = this.convertPatternToRegex(pattern)
    this.patternConfigs.push({ pattern: regexPattern, status, config })
  }

  // Configure error handling for pattern-based endpoints with any status
  configureErrorForPatternAnyStatus(pattern: string, config: ErrorConfig) {
    const regexPattern = this.convertPatternToRegex(pattern)
    this.patternConfigs.push({ pattern: regexPattern, status: -1, config }) // -1 means any status
  }

  // Configure error handling for pattern-based endpoints with specific method
  configureErrorForPatternAndMethod(pattern: string, status: number, method: string, config: ErrorConfig) {
    const regexPattern = this.convertPatternToRegex(pattern)
    this.patternConfigs.push({ 
      pattern: regexPattern, 
      status, 
      config,
      method: method.toUpperCase()
    })
  }

  // Configure error handling for pattern-based endpoints with any status and specific method
  configureErrorForPatternAndMethodAnyStatus(pattern: string, method: string, config: ErrorConfig) {
    const regexPattern = this.convertPatternToRegex(pattern)
    this.patternConfigs.push({ 
      pattern: regexPattern, 
      status: -1, 
      config,
      method: method.toUpperCase()
    })
  }

  private convertPatternToRegex(pattern: string): RegExp {
    // Convert "/forms/:form_id/q/:question_id" to regex
    const regexString = pattern
      .replace(/:[^\/]+/g, '[^/]+') // Replace :param with [^/]+
      .replace(/\//g, '\\/') // Escape forward slashes
    return new RegExp(`^${regexString}$`)
  }

  // Get error configuration for specific endpoint and status
  getErrorConfig(endpoint: string, status: number, method?: string): ErrorConfig | null {
    const httpMethod = method?.toUpperCase()
    
    // Check specific endpoint + status + method combination
    if (httpMethod) {
      const specificKey = `${endpoint}:${status}:${httpMethod}`
      if (this.errorConfigs.has(specificKey)) {
        return this.errorConfigs.get(specificKey)!
      }
    }

    // Check specific endpoint + status combination
    const specificKey = `${endpoint}:${status}`
    if (this.errorConfigs.has(specificKey)) {
      return this.errorConfigs.get(specificKey)!
    }

    // Check pattern-based configurations
    for (const { pattern, status: patternStatus, config, method: patternMethod } of this.patternConfigs) {
      const methodMatches = !patternMethod || patternMethod === httpMethod
      const statusMatches = patternStatus === -1 || patternStatus === status
      
      if (pattern.test(endpoint) && statusMatches && methodMatches) {
        return config
      }
    }

    // Check wildcard for status + method
    if (httpMethod) {
      const statusMethodKey = `*:${status}:${httpMethod}`
      if (this.errorConfigs.has(statusMethodKey)) {
        return this.errorConfigs.get(statusMethodKey)!
      }
    }

    // Check wildcard for status
    const statusKey = `*:${status}`
    if (this.errorConfigs.has(statusKey)) {
      return this.errorConfigs.get(statusKey)!
    }

    // Check wildcard for endpoint + method
    if (httpMethod) {
      const endpointMethodKey = `${endpoint}:*:${httpMethod}`
      if (this.errorConfigs.has(endpointMethodKey)) {
        return this.errorConfigs.get(endpointMethodKey)!
      }
    }

    // Check wildcard for endpoint
    const endpointKey = `${endpoint}:*`
    if (this.errorConfigs.has(endpointKey)) {
      return this.errorConfigs.get(endpointKey)!
    }

    return null
  }

  showError(title: string, message: string, _icon?: React.ComponentType, placeholderTitle?: string, placeholderAction?: React.ReactNode) {
    console.log('ErrorService: showError called', { title, message, hasModal: !!this.showErrorModal })
    
    if (this.showErrorModal) {
      console.log('ErrorService: calling showErrorModal')
      try {
        this.showErrorModal(title, message, _icon, placeholderTitle, placeholderAction)
      } catch (error) {
        console.error('ErrorService: Error showing modal:', error)
        // Fallback: log error instead of showing alert
        console.error('Error modal failed:', { title, message, error })
      }
    } else {
      console.log('ErrorService: showErrorModal is not set')
      // Fallback: log error instead of showing alert
      console.error('No error modal available:', { title, message })
    }
  }
}

export const errorService = ErrorService.getInstance()

// Error handler for HTTP responses
export class HttpErrorHandler {
  static handleAuthError(_error: any, retryRequest: () => Promise<any>) {
    return retryRequest()
  }

  static handleOtherErrors(error: any, status?: number) {
    try {
      console.log('HttpErrorHandler: handleOtherErrors called', { 
        status, 
        url: error.config?.url,
        method: error.config?.method,
        message: error.message 
      })
      
      const endpoint = this.getEndpointFromError(error)
      const method = error.config?.method
      console.log('HttpErrorHandler: endpoint extracted', endpoint)
      console.log('HttpErrorHandler: method extracted', method)
      
      const errorConfig = errorService.getErrorConfig(endpoint, status || 0, method)
      console.log('HttpErrorHandler: errorConfig found', errorConfig)
      
      // If no specific config, use default behavior (show modal)
      if (!errorConfig) {
        console.log('HttpErrorHandler: no config, using default error')
        return this.showDefaultError(error, status)
      }

      // If configured to not show modal, just reject
      if (!errorConfig.showModal) {
        console.log('HttpErrorHandler: config says not to show modal')
        return Promise.reject(error)
      }

      // Use custom configuration
      console.log('HttpErrorHandler: showing custom error modal')
      const title = errorConfig.customTitle || this.getDefaultTitle(status)
      const message = errorConfig.customMessage || error.response?.data?.error_message || error.message || 'Произошла неизвестная ошибка'
      const icon = errorConfig.customIcon || this.getDefaultIcon(status)
      const placeholderTitle = errorConfig.customPlaceholderTitle
      const placeholderAction = errorConfig.customPlaceholderAction

      errorService.showError(title, message, icon, placeholderTitle, placeholderAction)
      return Promise.reject(error)
    } catch (handlerError) {
      console.error('HttpErrorHandler: Error in handleOtherErrors:', handlerError)
      // Fallback: log error and reject the original error
      console.error('Error handler failed:', { error: error.message, handlerError })
      return Promise.reject(error)
    }
  }

  private static getEndpointFromError(error: any): string {
    const url = error.config?.url || error.request?.responseURL || ''
    const endpoint = url.replace(import.meta.env.VITE_API_URL, '').split('?')[0]
    return endpoint
  }

  private static showDefaultError(error: any, status?: number) {
    const title = this.getDefaultTitle(status)
    const message = error.response?.data?.error_message || error.message || 'Произошла неизвестная ошибка'
    const icon = this.getDefaultIcon(status)

    errorService.showError(title, message, icon)
    return Promise.reject(error)
  }

  private static getDefaultTitle(status?: number): string {
    if (status === 400) return 'Некорректный запрос'
    if (status === 403) return 'Ошибка доступа'
    if (status === 404) return 'Страница не найдена'
    if (status === 500) return 'Внутренняя ошибка'
    return 'Ошибка'
  }

  private static getDefaultIcon(status?: number): React.ComponentType {
    if (status === 400) return Icon56CancelCircleOutline
    if (status === 403) return Icon56LockOutline
    if (status === 404) return Icon56GhostOutline
    if (status === 500) return Icon56GlobeCrossOutline
    return Icon56CancelCircleOutline
  }

  static showAuthError() {
    errorService.showError(
      'Ошибка авторизации',
      'Не удалось обновить токен доступа. Перезагрузите страницу и попробуйте снова',
      Icon56KeyOutline
    )
  }
} 