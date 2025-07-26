import { SubscriptionItem, useGetSubscriptions } from '@entities/subscriptions'
import { Group, Header, Placeholder } from '@vkontakte/vkui'
import { Icon48StarsCircleFillViolet } from '@vkontakte/icons'
import { SubscriptionButton } from '@features/index'
import React from 'react'

export const SubscriptionHero = () => {

  const { data: subscriptions } = useGetSubscriptions()
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  
  React.useEffect(() => {
    if (subscriptions) {
      setIsSubscribed(subscriptions.length > 0)
    }
  }, [subscriptions])

  return(
    <Group
      header={
        <Header size='l'>
          Подписка
        </Header>
      }
    >
      {(isSubscribed) ? (
        subscriptions!.map((subscription) => (
          <SubscriptionItem key={subscription.subscription_id} {...subscription} />
        ))
      ) : (
        <Placeholder
          icon={<Icon48StarsCircleFillViolet width={56} height={56} />}
          title='Подписка, которая думает за тебя'
          action={<SubscriptionButton
            title='Подключить'
            itemId='standard_30'
          />}
        >
          Прокачай свои анкеты и получи доступ к новым функциям!
        </Placeholder>
      )}
    </Group>
  )
}