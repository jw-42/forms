import { useQuery } from '@tanstack/react-query'
import { apiClient } from './config'
import bridge from '@vkontakte/vk-bridge'
import { useDispatch } from 'react-redux'
import { setAccessToken } from '@app/store/config-slice'

export const useAuth = () => {
  const dispatch = useDispatch()

  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const params = await bridge.send('VKWebAppGetLaunchParams')
      const response = await apiClient.post<{ access_token: string }>('/auth/login', params)
      dispatch(setAccessToken(response.access_token))
      return response.access_token
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false
  })
} 