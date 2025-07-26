import { useRefreshSubscriptions, useGetSubscriptions } from '@entities/subscriptions'
import { SubscriptionButtonProps } from './types'
import bridge from '@vkontakte/vk-bridge'
import { Button } from '@vkontakte/vkui'

export const SubscriptionButton = ({ title = 'Попробовать', itemId, ...props }: SubscriptionButtonProps) => {

  const refreshSubscriptions = useRefreshSubscriptions()
  const { data: subscriptions } = useGetSubscriptions()

  const handleSubscribe = async () => {
    try {
      if (itemId === 'free' && subscriptions && subscriptions.length > 0) {
        const activeSub = subscriptions.find(
          sub => (sub.status === 'active' || sub.status === 'chargeable') && sub.item_id !== 'free'
        )
        if (activeSub) {
          const cancelData = await bridge.send('VKWebAppShowSubscriptionBox', {
            action: 'cancel',
            subscription_id: activeSub.subscription_id.toString(),
          })
          if (cancelData.success) {
            await refreshSubscriptions()
          } else {
            console.log('Subscription cancellation failed')
            return
          }
        }
      }
      
      // Создаем подписку
      const data = await bridge.send('VKWebAppShowSubscriptionBox', {
        action: 'create',
        item: itemId,
      })
      if (data.success) {
        await refreshSubscriptions()
      } else {
        console.log('Subscription creation failed')
      }
    } catch (error) {
      console.error('Error creating/cancelling subscription:', error)
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