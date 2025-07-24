import { ResizePanel, routes } from "@shared/index"
import { Icon28NewsfeedOutline, Icon28MagicWandOutline, Icon28StatisticsOutline, Icon48StarsCircleFillViolet } from "@vkontakte/icons"
import bridge from "@vkontakte/vk-bridge"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { Button, Cell, Div, Group, Header, NavIdProps, PanelHeaderBack, Placeholder, Spacing } from "@vkontakte/vkui"

export const Subscription = (props: NavIdProps) => {

  const router = useRouteNavigator()

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
          console.log('Subscription created successfully')
        } else {
          console.log('Subscription creation failed')
        }
      })
      .catch((error) => {
        console.error('Error creating subscription:', error)
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

        <Spacing/>

        <Div>
          <Button stretched size='l' mode='secondary' onClick={handleSubscribe}>
            Попробовать бесплатно
          </Button>
        </Div>
      </Group>
    </ResizePanel>
  )
}