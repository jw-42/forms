import { Icon24BillheadOutline, Icon24RecentOutline, Icon28SettingsOutline } from "@vkontakte/icons"
import { Tabbar, TabbarItem } from "@vkontakte/vkui"
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { routes, VIEW } from "@shared/model"

export const EpicTabbar = () => {

  const router = useRouteNavigator()

  const { view: activeView } = useActiveVkuiLocation()

  return (
    <Tabbar>
      <TabbarItem
        label='Анкеты'
        selected={activeView === VIEW.FORMS}
        onClick={() => router.push(routes.forms.overview.path)}
      >
        <Icon24BillheadOutline />
      </TabbarItem>

      <TabbarItem
        label='Ответы'
        onClick={() => router.push(routes.answers.overview.path)}
      >
        <Icon24RecentOutline />
      </TabbarItem>

      <TabbarItem
        label='Настройки'
        onClick={() => router.push(routes.settings.overview.path)}
      >
        <Icon28SettingsOutline width={24} height={24} />
      </TabbarItem>
    </Tabbar>
  )
}