import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@app/store'

export const API_URL = import.meta.env.VITE_API_URL

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