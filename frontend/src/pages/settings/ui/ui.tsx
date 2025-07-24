import { ResizePanel } from "@shared/ui"
import { Button, Cell, Group, Header, NavIdProps, PanelHeaderBack, Snackbar } from "@vkontakte/vkui"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { routes } from "@shared/model"
import bridge from "@vkontakte/vk-bridge"
import { Icon24CheckCircleFillGreen, Icon32StarsCircleFillViolet } from "@vkontakte/icons"

export const Settings = (props: NavIdProps) => {

  const router = useRouteNavigator()

  const handleBack = () => {
    router.push(routes.forms.overview.path)
  }

  const showMessagesAllowed = () => {
    router.showPopout(
      <Snackbar
        onClose={() => router.hidePopout()}
        before={<Icon24CheckCircleFillGreen/>}
      >
        Сообщения разрешены
      </Snackbar>
    )
  }

  const handleAllowMessages = () => {
    bridge.send('VKWebAppAllowMessagesFromGroup', { group_id: 231619871 })
      .then((data) => {
        if (data.result) {
          showMessagesAllowed()
        }
      })
  }

  return(
    <ResizePanel
      title='Настройки'
      before={<PanelHeaderBack onClick={handleBack} />}
      {...props}
    >
      <Group>
        <Cell
          before={<Icon32StarsCircleFillViolet/>}
          extraSubtitle='Меньше кликов — больше смысла'
          onClick={() => router.push(routes.subscription.overview.path)}
        >
          Подписка, которая думает за тебя
        </Cell>
      </Group>

      <Group header={
        <Header size='l'>Настройки</Header>
      }>
        <Cell
          multiline
          after={<Button size='s' mode='secondary' onClick={handleAllowMessages}>Разрешить</Button>}
          extraSubtitle='Чтобы мы могли написать вам сообщение'
        >
          Сообщения от сообщества
        </Cell>
      </Group>
    </ResizePanel>
  )
}