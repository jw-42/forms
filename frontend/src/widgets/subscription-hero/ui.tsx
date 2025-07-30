import { useGetSubscriptions } from '@entities/subscriptions'
import { Button, Card, Group, Placeholder, Separator, Spacing, Headline, CardGrid, Subhead, Header, FormLayoutGroup, FormItem, Input } from '@vkontakte/vkui'
import { Icon28Flash, Icon56CoinsStackHighOutline, Icon56CoinsStacks3Outline, Icon56DiamondOutline } from '@vkontakte/icons'
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
          Баланс
        </Header>
      }
    >
      <Placeholder
        icon={<Icon28Flash width={56} height={56} color='var(--vkui--color_icon_positive)' />}
        title='Ваш баланс: 100 бустов'
        action={
          <FormLayoutGroup mode='horizontal'>
            <FormItem>
              <Input
                type='number'
                placeholder='Сколько бустов купить?'
              />
            </FormItem>

            <Button
              size='l'
              mode='primary'
              appearance='positive'
              style={{ marginLeft: 8 }}
            >
              Пополнить
            </Button>
          </FormLayoutGroup>
        }
      >
        Этого хватит, чтобы прокачать 42 анкеты.
      </Placeholder>

      <Spacing>
        <Separator/>
      </Spacing>

      <Spacing size={12} />

      <CardGrid size='s'>
        <Card
          mode='outline'
          style={{
            padding: '24px 8px 8px 8px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 120,
            maxHeight: 120,
            justifyContent: 'center'
          }}>
            <Icon56CoinsStackHighOutline color='var(--vkui--color_icon_secondary)' />

            <Spacing/>

            <Headline level='2' weight='1'>
              15 бустов
            </Headline>

            <Subhead style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
              Выгода 13%
            </Subhead>
          </div>

          <Button
            size='s'
            stretched
            mode='secondary'
            appearance='positive'
          >
            13 голосов
          </Button>
        </Card>

        <Card
          mode='outline'
          style={{
            padding: '24px 8px 8px 8px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            minHeight: 120,
            maxHeight: 120,
            justifyContent: 'center'
          }}>
            <Icon56CoinsStacks3Outline color='var(--vkui--color_icon_secondary)' />

            <Spacing/>

            <Headline level='2' weight='1'>
              30 бустов
            </Headline>

            <Subhead style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
              Выгода 17%
            </Subhead>
          </div>

          <Button
            size='s'
            stretched
            mode='secondary'
            appearance='positive'
          >
            25 голосов
          </Button>
        </Card>

        <Card
          mode='outline'
          style={{
            padding: '24px 8px 8px 8px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 120,
            maxHeight: 120,
            justifyContent: 'center'
          }}>
            <Icon56DiamondOutline color='var(--vkui--color_icon_secondary)' />

            <Spacing/>

            <Headline level='2' weight='1'>
              100 бустов
            </Headline>

            <Subhead style={{ textAlign: 'center', color: 'var(--vkui--color_text_secondary)' }}>
              Выгода 25%
            </Subhead>
          </div>

          <Button
            size='s'
            stretched
            mode='secondary'
            appearance='positive'
          >
            75 голосов
          </Button>
        </Card>
      </CardGrid>

      {/* <Spacing>
        <Separator/>
      </Spacing>

      <Cell
        extraSubtitle='Активен • Платёж 31 авг 2025'
        after={
          <Button
            size='s'
            mode='secondary'
          >
            Отменить
          </Button>
        }
      >
        Пакет «Премиум»
      </Cell> */}

      {/* {(isSubscribed) ? (
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
      )} */}
    </Group>
  )
}