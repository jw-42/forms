import { routes } from "@shared/index";
import { VIEW } from "@shared/index";
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, Cell, Div, Group, Panel, Separator, Spacing } from "@vkontakte/vkui";

export const Sidebar = () => {

  const router = useRouteNavigator()

  const { view: activeStory = VIEW.FORMS } = useActiveVkuiLocation()

  return (
    <Panel>
      <Group>
        <Div>
          <Button
            stretched
            size='l'
            onClick={() => router.push(routes.forms.builder.path)}
          >
            Создать анкету
          </Button>
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
          activated={false}
          onClick={() => router.push(routes.forms.overview.path)}
        >
          История ответов
        </Cell>
      </Group>
    </Panel>
  )
}