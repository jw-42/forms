import { formatDate, ResizePanel, routes } from "@shared/index"
import { Icon28NewsfeedOutline, Icon28MagicWandOutline, Icon28StatisticsOutline, Icon48StarsCircleFillViolet } from "@vkontakte/icons"
import bridge from "@vkontakte/vk-bridge"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Button, Cell, Div, Group, Header, NavIdProps, PanelHeaderBack, Placeholder, Spacing } from "@vkontakte/vkui"
import { queryClient } from '@shared/index'
import { subscriptionsKeys, useGetSubscriptions } from '@entities/subscriptions'
import React from 'react'

// Карта для читаемых названий подписок по item_id
const SUBSCRIPTION_TITLES: Record<string, string> = {
  'vk_testers_30': 'Премиум для VK Testers',
  // Добавьте другие item_id по мере необходимости
}

function getSubscriptionTitleByItemId(item_id: string): string {
  return SUBSCRIPTION_TITLES[item_id] || item_id
}

// Карта для читаемых статусов
const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  'active': 'Активна',
  'chargeable': 'Ожидает оплаты',
  'cancelled': 'Отменена',
}

function getSubscriptionStatusLabel(status: string): string {
  return SUBSCRIPTION_STATUS_LABELS[status] || status
}

export const Subscription = (props: NavIdProps) => {

  const router = useRouteNavigator()
  const { data: subscriptions } = useGetSubscriptions()

  const handleBack = () => {
    router.push(routes.forms.overview.path)
  }

  const handleSubscribe = async () => {
    bridge.send('VKWebAppShowSubscriptionBox', {
      action: 'create',
      item: 'vk_testers_30',
    })
      .then((data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: subscriptionsKeys.list() })
        } else {
          console.log('Subscription creation failed')
        }
      })
      .catch((error) => {
        console.error('Error creating subscription:', error)
      })
  }

  const handleCancelSubscription = async (subscription_id: number) => {
    bridge.send('VKWebAppShowSubscriptionBox', {
      action: 'cancel',
      subscription_id: subscription_id.toString(),
    })
      .then((data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: subscriptionsKeys.list() })
        } else {
          console.log('Subscription cancellation failed')
        }
      })
  }

  return(
    <ResizePanel
      title='Подписка'
      before={<PanelHeaderBack onClick={handleBack} />}
      {...props}
    >
      <Group
        header={
          <Header size='l'>
            Подписка
          </Header>
        }
      >
        {(subscriptions && subscriptions?.length > 0) ? (
          subscriptions.map((subscription) => (
            <Cell
              multiline
              key={subscription.subscription_id}
              extraSubtitle={
                `${getSubscriptionStatusLabel(subscription.status)} ${subscription.next_bill_time ? ` • Списание ${formatDate(subscription.next_bill_time)}` : ''}`
              }
              after={
                <Button size='s' mode='secondary' onClick={() => handleCancelSubscription(subscription.subscription_id)}>
                  Отменить
                </Button>
              }
            >
              {getSubscriptionTitleByItemId(subscription.item_id)}
            </Cell>
          ))
        ) : (
          <Placeholder
            icon={<Icon48StarsCircleFillViolet width={56} height={56} />}
            title='Подписка, которая думает за тебя'
            action={
              <Button size='l' mode='secondary' onClick={handleSubscribe}>
                Попробовать бесплатно
              </Button>
            }
          >
            Прокачай свои анкеты и получи доступ к новым функциям!
          </Placeholder>
        )}
      </Group>

      <Group
        header={
          <Header size='l'>
            Преимущества
          </Header>
        }
      >
        <Cell
          multiline
          before={<Icon28MagicWandOutline/>}
          extraSubtitle='Мы сгенерируем описание, вопросы и варианты'
        >
          Создавай анкеты в один клик
        </Cell>

        <Cell
          multiline
          before={<Icon28StatisticsOutline/>}
          extraSubtitle='Детальные отчёты и возможность экспорта данных'
        >
          Продвинутая аналитика
        </Cell>

        <Cell
          multiline
          before={<Icon28NewsfeedOutline/>}
          extraSubtitle='Для тебя и всех, кто просматривает твои анкеты'
        >
          Отключение рекламы
        </Cell>

        {(subscriptions && subscriptions.length === 0) && (
          <React.Fragment>
            <Spacing/>

            <Div>
              <Button stretched size='l' mode='secondary' onClick={handleSubscribe}>
                Попробовать бесплатно
              </Button>
            </Div>
          </React.Fragment>
        )}
      </Group>
    </ResizePanel>
  )
}