import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@app/store'
import { Icon56CancelCircleOutline, Icon56DocumentOutline, Icon56GlobeCrossOutline, Icon56KeyOutline, Icon56LockOutline } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { setAccessToken, setUserId } from '@app/store/config-slice'

export const API_URL = import.meta.env.VITE_API_URL

// Global error handler
class ErrorService {
  private static instance: ErrorService
  private showErrorModal?: ((title: string, message: string, icon: React.ReactNode) => void) | undefined

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  setErrorModal(showErrorModal: ((title: string, message: string, icon: React.ReactNode) => void) | undefined) {
    this.showErrorModal = showErrorModal
  }

  showError(title: string, message: string, icon: React.ReactNode) {
    if (this.showErrorModal) {
      this.showErrorModal(title, message, icon)
    }
  }
}

export const errorService = ErrorService.getInstance()

// Function to refresh access token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const params = await bridge.send('VKWebAppGetLaunchParams')
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    
    if (response.ok) {
      const data = await response.json()
      store.dispatch(setAccessToken(data.access_token))
      store.dispatch(setUserId(params.vk_user_id as number))
      return data.access_token
    }
    return null
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

class Api {
  private api: AxiosInstance

  constructor (baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.api.interceptors.request.use((config) => {
      const token = store.getState().config.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status
        let message = error.response?.data?.error_message || error.message || 'Произошла неизвестная ошибка'
        let icon;

        let title = 'Ошибка'
        if (status === 400) {
          title = 'Некорректный запрос'
          icon = <Icon56CancelCircleOutline/>
          message = 'Один или несколько параметров запроса некорректны'
        } else if (status === 401) {
          // Try to refresh token instead of showing error modal
          const newToken = await refreshAccessToken()
          if (newToken) {
            // Retry the original request with new token
            const originalRequest = error.config
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.api.request(originalRequest)
          } else {
            // If refresh failed, show error modal
            title = 'Ошибка авторизации'
            icon = <Icon56KeyOutline/>
            message = 'Не удалось обновить токен доступа. Перезагрузите страницу и попробуйте снова'
          }
        } else if (status === 403) {
          title = 'Ошибка доступа'
          icon = <Icon56LockOutline/>
          message = 'У вас нет доступа к этой странице'
        } else if (status === 404) {
          title = 'Страница не найдена'
          icon = <Icon56DocumentOutline/>
          message = 'Возможно, она была удалена или ещё не создана'
        } else if (status === 500) {
          title = 'Ошибка сервера'
          icon = <Icon56GlobeCrossOutline/>
          message = 'Произошла ошибка на сервере. Попробуйте позже'
        }

        errorService.showError(title, message, icon)
        return Promise.reject(error)
      }
    )
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(endpoint, config)
    return response.data
  }

  async post<T>(endpoint: string, queryParams?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(endpoint, queryParams, config)
    return response.data
  }

  async put<T>(endpoint: string, queryParams?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(endpoint, queryParams, config)
    return response.data
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(endpoint, config)
    return response.data
  }
}

export const apiClient = new Api(API_URL)