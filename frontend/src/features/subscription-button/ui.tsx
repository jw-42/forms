import { SubscriptionButtonProps } from './types'
import bridge from '@vkontakte/vk-bridge'
import { Button } from '@vkontakte/vkui'

export const SubscriptionButton = ({ title = 'Попробовать', itemId, ...props }: SubscriptionButtonProps) => {

  const handleSubscribe = async () => {
    try {
      // Создаем подписку
      const data = await bridge.send('VKWebAppShowSubscriptionBox', {
        action: 'create',
        item: itemId,
      })
      if (!data.success) {
        console.log('Subscription creation failed')
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
    }
  }
  
  return(
    <Button
      size='l'
      mode='primary'
      onClick={handleSubscribe}
      {...props}
    >
      {title}
    </Button>
  )
}