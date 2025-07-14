import bridge from '@vkontakte/vk-bridge'
import { store } from '@app/store'
import { setAccessToken, setUserId } from '@app/store/config-slice'
import { errorService } from './error-handler'

export const API_URL = import.meta.env.VITE_API_URL

// Token refresh service with lock mechanism
export class TokenRefreshService {
  private refreshPromise: Promise<string | null> | null = null

  async refreshToken(): Promise<string | null> {
    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Create new refresh promise
    this.refreshPromise = this.performTokenRefresh()
    return this.refreshPromise
  }

  private async performTokenRefresh(): Promise<string | null> {
    console.log('TokenRefreshService: performTokenRefresh started')
    try {
      const params = await bridge.send('VKWebAppGetLaunchParams')
      console.log('TokenRefreshService: got launch params, making request to', `${API_URL}/auth/login`)
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      console.log('TokenRefreshService: response received', { status: response.status, ok: response.ok })
      
      if (response.ok) {
        const data = await response.json()
        store.dispatch(setAccessToken(data.access_token))
        store.dispatch(setUserId(params.vk_user_id as number))
        return data.access_token
      }

      // Handle error response
      console.log('TokenRefreshService: handling error response')
      const errorData = await response.json().catch(() => ({}))
      this.handleTokenRefreshError(response.status, errorData.error_message)
      return null
    } catch (error) {
      console.error('TokenRefreshService: Failed to refresh token:', error)
      this.handleTokenRefreshError(0, 'Network error')
      return null
    } finally {
      // Clear the promise after completion
      this.refreshPromise = null
    }
  }

  private handleTokenRefreshError(status: number, message?: string) {
    console.log('TokenRefreshService: handleTokenRefreshError called', { status, message })
    
    // Check if we should show error modal for this status
    const errorConfig = errorService.getErrorConfig('/auth/login', status)
    console.log('TokenRefreshService: errorConfig', errorConfig)
    
    if (errorConfig && errorConfig.showModal) {
      console.log('TokenRefreshService: showing error modal')
      const title = errorConfig.customTitle || this.getDefaultTitle(status)
      const errorMessage = errorConfig.customMessage || message || this.getDefaultMessage(status)
      const icon = errorConfig.customIcon || this.getDefaultIcon(status)
      
      console.log('TokenRefreshService: calling errorService.showError', { title, errorMessage })
      errorService.showError(title, errorMessage, icon)
    } else {
      console.log('TokenRefreshService: not showing modal', { 
        hasConfig: !!errorConfig, 
        showModal: errorConfig?.showModal 
      })
    }
  }

  private getDefaultTitle(status: number): string {
    if (status === 400) return 'Некорректный запрос'
    if (status === 401) return 'Ошибка авторизации'
    if (status === 403) return 'Ошибка доступа'
    if (status === 404) return 'Страница не найдена'
    if (status === 500) return 'Внутренняя ошибка'
    return 'Ошибка'
  }

  private getDefaultMessage(status: number): string {
    if (status === 400) return 'Один или несколько параметров запроса некорректны'
    if (status === 401) return 'Неверные учетные данные'
    if (status === 403) return 'У вас нет доступа к этой странице'
    if (status === 404) return 'Возможно, она была удалена или ещё не создана'
    if (status === 500) return 'Произошла ошибка на сервере. Попробуйте позже'
    return 'Произошла неизвестная ошибка'
  }

  private getDefaultIcon(status: number): any {
    // Import icons here to avoid circular dependency
    const { Icon56CancelCircleOutline, Icon56KeyOutline, Icon56LockOutline, Icon56DocumentOutline, Icon56GlobeCrossOutline } = require('@vkontakte/icons')
    
    if (status === 400) return Icon56CancelCircleOutline
    if (status === 401) return Icon56KeyOutline
    if (status === 403) return Icon56LockOutline
    if (status === 404) return Icon56DocumentOutline
    if (status === 500) return Icon56GlobeCrossOutline
    return Icon56CancelCircleOutline
  }
}

export const tokenRefreshService = new TokenRefreshService() 