import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@app/store'
import { tokenRefreshService } from './token-refresh'
import { errorService, HttpErrorHandler } from './error-handler'
import { configureErrorHandling } from './error-config'

configureErrorHandling()

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

    this.api.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        try {
          const status = error.response?.status
          
          if (status === 401) {
            return this.handleAuthError(error)
          }
          
          return HttpErrorHandler.handleOtherErrors(error, status)
        } catch (interceptorError) {
          console.error('Api interceptor: Error in error handler:', interceptorError)
          console.error('Api interceptor failed:', { error: error.message, interceptorError })
          return Promise.reject(error)
        }
      }
    )
  }

  private async handleAuthError(error: any) {
    const newToken = await tokenRefreshService.refreshToken()
    if (newToken) {
      const originalRequest = error.config
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return this.api.request(originalRequest)
    } else {
      HttpErrorHandler.showAuthError()
      return Promise.reject(error)
    }
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

export const apiClient = new Api(import.meta.env.VITE_API_URL)
export { errorService }