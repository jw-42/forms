import { FORMS_TABS, routes } from "@shared/model/routes/routes";
import { ResizePanel, ScrollCell } from "@shared/ui";
import { Icon32Camera } from "@vkontakte/icons";
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Group, Header, HorizontalCell, HorizontalScroll, NavIdProps, Tabs, TabsItem } from "@vkontakte/vkui";
import { FormsList } from "@widgets/forms-list";

export const Forms = (props: NavIdProps) => {

  const router = useRouteNavigator()

  const { tab: activeTab = FORMS_TABS.DEFAULT } = useActiveVkuiLocation()

  return (
    <ResizePanel {...props} title='Мои анкеты'>
      <Group header={
        <Header size='l'>Шаблоны</Header>
      }>
        <HorizontalScroll arrowSize='s'>
          <HorizontalCell
            size='xl'
            title='Пустая анкета'
            subtitle='Начни с чистого листа'
            onClick={() => router.push(routes.forms.builder.path)}
          >
            <ScrollCell>
              <Icon32Camera color='var(--vkui--color_icon_secondary)' />
            </ScrollCell>
          </HorizontalCell>
        </HorizontalScroll>
      </Group>

      <Group>
        <Tabs
          mode='accent'
          layoutFillMode='shrinked'
        >
          <HorizontalScroll arrowSize='s'>
            <TabsItem
              selected={activeTab === FORMS_TABS.DEFAULT}
              onClick={() => router.push(routes.forms.overview.default.path)}
            >Мои анкеты</TabsItem>

            <TabsItem
              selected={activeTab === FORMS_TABS.FAVORITES}
              onClick={() => router.push(routes.forms.overview.favorites.path)}
            >Избранные</TabsItem>
          </HorizontalScroll>
        </Tabs>

        <FormsList mode={activeTab as 'default' | 'favorites'} />
      </Group>
    </ResizePanel>
  )
}