import { Cell, IconButton } from '@vkontakte/vkui'
import { Subscription, SUBSCRIPTION_STATUS_LABELS, SUBSCRIPTION_TITLE_LABELS } from './types'
import { useAutoUpdateTime } from '@shared/lib'
import { Icon24CancelOutline } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'

export const SubscriptionItem = (s: Subscription) => {
  
  const nextBillTime = useAutoUpdateTime(s.next_bill_time)

  const handleCancelSubscription = () => {
    bridge.send('VKWebAppShowSubscriptionBox', {
      action: 'cancel',
      subscription_id: s.subscription_id.toString(),
    })
      .then((data) => {
        if (!data.success) {
          console.log('Subscription cancellation failed')
        }
      })
  }

  return(
    <Cell
      multiline
      extraSubtitle={
        SUBSCRIPTION_STATUS_LABELS[s.status] +
        (s.status !== 'cancelled' && nextBillTime ? ` • Платёж ${nextBillTime}` : '')
      }
      after={
        <IconButton onClick={handleCancelSubscription}>
          <Icon24CancelOutline color='var(--vkui--color_icon_secondary)' />
        </IconButton>
      }
    >
      {SUBSCRIPTION_TITLE_LABELS[s.item_id]}
    </Cell>
  )
}