import { BLANK_TABS, routes } from "@shared/model"
import { useActiveVkuiLocation, useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { TabsItem } from "@vkontakte/vkui"

import { HorizontalScroll } from "@vkontakte/vkui"

import { Tabs } from "@vkontakte/vkui"

export const BlankTabs = () => {
  
  const params = useParams()
  const router = useRouteNavigator()

  const { tab: activeTab } = useActiveVkuiLocation()

  return (
    <Tabs mode='accent' layoutFillMode='shrinked'>
      <HorizontalScroll arrowSize='s'>
        <TabsItem
          selected={activeTab === BLANK_TABS.QUESTIONS}
          onClick={() => router.push(routes.forms.blank.questions.path, { id: params?.id })}
        >Вопросы</TabsItem>
        <TabsItem
          selected={activeTab === BLANK_TABS.ANSWERS}
          onClick={() => router.push(routes.forms.blank.answers.path, { id: params?.id })}
        >Ответы</TabsItem>
        <TabsItem
          selected={activeTab === BLANK_TABS.OPTIONS}
          onClick={() => router.push(routes.forms.blank.options.path, { id: params?.id })}
        >Настройки</TabsItem>
      </HorizontalScroll>
    </Tabs>
  )
}