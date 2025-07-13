import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@app/store'

export const API_URL = import.meta.env.VITE_API_URL

// Global error handler
class ErrorService {
  private static instance: ErrorService
  private showErrorModal?: ((title: string, message: string) => void) | undefined

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  setErrorModal(showErrorModal: ((title: string, message: string) => void) | undefined) {
    this.showErrorModal = showErrorModal
  }

  showError(title: string, message: string) {
    if (this.showErrorModal) {
      this.showErrorModal(title, message)
    }
  }
}

export const errorService = ErrorService.getInstance()

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
      (error) => {
        const status = error.response?.status
        const message = error.response?.data?.message || error.message || 'Произошла неизвестная ошибка'
        
        let title = 'Ошибка'
        if (status === 401) {
          title = 'Ошибка авторизации'
        } else if (status === 403) {
          title = 'Доступ запрещен'
        } else if (status === 404) {
          title = 'Не найдено'
        } else if (status === 500) {
          title = 'Ошибка сервера'
        }

        errorService.showError(title, message)
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