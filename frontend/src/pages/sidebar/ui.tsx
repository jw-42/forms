import { useGetBalance } from "@entities/payments";
import { VIEW, routes } from "@shared/index";
import { Icon20FlashOutline, Icon32StarsCircleFillViolet } from "@vkontakte/icons";
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, ButtonGroup, Cell, Div, Group, Panel, Separator, Spacing } from "@vkontakte/vkui";

export const Sidebar = () => {

  const router = useRouteNavigator()

  const { data: balanceData } = useGetBalance()

  const { view: activeStory = VIEW.FORMS } = useActiveVkuiLocation()

  return (
    <Panel>
      <Group>
        <Div>
          <ButtonGroup gap='s' stretched mode='horizontal'>
            <Button
              stretched
              size='l'
              onClick={() => router.push(routes.forms.builder.path)}
            >
              Создать анкету
            </Button>

            <Button
              size='l'
              appearance='positive'
              before={<Icon20FlashOutline/>}
              onClick={() => router.push(routes.payments.overview.path)}
            >
              {balanceData?.balance || 0}
            </Button>
          </ButtonGroup>
        </Div>

        <Spacing>
          <Separator/>
        </Spacing>

        <Cell
          activated={activeStory === VIEW.FORMS}
          onClick={() => router.push(routes.forms.overview.path)}
        >
          Мои анкеты
        </Cell>

        <Spacing size={2} />

        <Cell
          activated={activeStory === VIEW.SETTINGS}
          onClick={() => router.push(routes.settings.overview.path)}
        >
          Настройки
        </Cell>

        <Spacing size={2} />

        <Cell
          activated={activeStory === VIEW.HELP}
          onClick={() => router.push(routes.help.overview.path)}
        >
          Помощь
        </Cell>

        <Spacing>
          <Separator/>
        </Spacing>

        <Cell
          before={<Icon32StarsCircleFillViolet/>}
          extraSubtitle='Меньше кликов — больше смысла'
          onClick={() => router.push(routes.payments.overview.path)}
        >
          Подписка, которая думает за тебя
        </Cell>
      </Group>
    </Panel>
  )
}