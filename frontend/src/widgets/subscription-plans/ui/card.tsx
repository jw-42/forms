import { Plan } from '../types'
import { Card, Div, SimpleCell, Spacing, Text } from '@vkontakte/vkui'
import { Icon28CheckCircleFill } from '@vkontakte/icons'
import { Icon28CancelCircleOutline } from '@vkontakte/icons'
import { MiniInfoCell } from '@vkontakte/vkui'
import { useGetSubscriptions } from '@entities/subscriptions'
import { SubscriptionButton } from '@features/subscription-button'

export const SubscriptionCard = ({ plan }: { plan: Plan }) => {

  const { data: subscriptions } = useGetSubscriptions()

  // Найти подписку по itemId
  const currentSubscription = subscriptions?.find(
    subscription => subscription.item_id === plan.itemId
  )

  let buttonText = 'Выбрать'
  let isActiveSubscription = false

  if (currentSubscription) {
    if (currentSubscription.status === 'chargeable') {
      buttonText = 'Ожидание оплаты'
      isActiveSubscription = true
    } else if (currentSubscription.status === 'active') {
      buttonText = 'Текущий план'
      isActiveSubscription = true
    }
  } else if (subscriptions?.length === 0 && plan.price === 0) {
    buttonText = 'Текущий план'
    isActiveSubscription = true
  }

  return(
    <Card
      mode='outline'
      style={{
        minWidth: 280,
        maxWidth: 280,
        flexShrink: 0
      }}
    >
      <SimpleCell
        before={plan.icon}
        extraSubtitle={plan.description}
        style={{ paddingTop: 4 }}
      >
        <Text weight='1' style={{ fontSize: 16 }}>
          {plan.title}
        </Text>
      </SimpleCell>
      
      <Spacing size={16} />

      <Div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <Text weight='2' style={{ fontSize: 24 }}>
            {plan.price === 0 ? 'Бесплатно' : `${plan.price} голосов`}
          </Text>

          <Text style={{ fontSize: 14, color: 'var(--vkui--color_text_secondary)'  }}>
            / {plan.period}
          </Text>
        </div>
      </Div>

      <div style={{ minHeight: 192, maxHeight: 192, overflow: 'auto' }}>
        {plan.features.map((feature, index) => (
          <MiniInfoCell
            key={index}
            textWrap='nowrap'
            before={feature.included 
              ? <Icon28CheckCircleFill fill="var(--vkui--color_icon_positive)" width={20} height={20} />
              : <Icon28CancelCircleOutline fill="var(--vkui--color_icon_secondary)" width={20} height={20} />
            }
          >
            <Text style={{ fontSize: 14, color: feature.included ? 'var(--vkui--color_text_primary)' : 'var(--vkui--color_text_secondary)' }}>
              {feature.text}
            </Text>
          </MiniInfoCell>
        ))}
      </div>

      <Div>
        <SubscriptionButton
          stretched
          title={buttonText}
          disabled={isActiveSubscription}
          itemId={plan.itemId}
          appearance={plan.itemId === 'premium_30' ? 'positive' : 'accent'}
        />
      </Div>
    </Card>
  )
}