import { useGetSubscriptions } from "@entities/subscriptions";
import { routes } from "@shared/index";
import { VIEW } from "@shared/index";
import { Icon24GearOutline, Icon32StarsCircleFillViolet } from "@vkontakte/icons";
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, ButtonGroup, Cell, Div, Group, Panel, Separator, Spacing } from "@vkontakte/vkui";
import React from "react";

export const Sidebar = () => {

  const router = useRouteNavigator()

  const { data: subscriptions } = useGetSubscriptions()

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
              mode='secondary'
              before={<Icon24GearOutline/>}
              onClick={() => router.push(routes.settings.overview.path)}
            />
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
          activated={activeStory === VIEW.ANSWERS}
          onClick={() => router.push(routes.answers.overview.path)}
        >
          История ответов
        </Cell>

        <Spacing>
          <Separator/>
        </Spacing>

        <Cell
          activated={activeStory === VIEW.HELP}
          onClick={() => router.push(routes.help.overview.path)}
        >
          Помощь
        </Cell>

        {(subscriptions && subscriptions.length === 0) && (
          <React.Fragment>
            <Spacing>
              <Separator/>
            </Spacing>

            <Cell
              before={<Icon32StarsCircleFillViolet/>}
              extraSubtitle='Меньше кликов — больше смысла'
              onClick={() => router.push(routes.subscription.overview.path)}
            >
              Подписка, которая думает за тебя
            </Cell>
          </React.Fragment>
        )}
      </Group>
    </Panel>
  )
}