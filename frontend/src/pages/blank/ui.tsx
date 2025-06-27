import { Group, NavIdProps, PanelHeaderBack } from "@vkontakte/vkui"
import { useActiveVkuiLocation, useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { BlankTabs, BlankCover, BlankQuestions, BlankAnswers } from "@widgets/index"
import { BLANK_TABS, routes } from "@shared/model"
import { ResizePanel } from "@shared/ui"
import React from "react"

export const Blank = (props: NavIdProps) => {

  const params = useParams()
  const router = useRouteNavigator()
  const { tab: activeTab = BLANK_TABS.QUESTIONS } = useActiveVkuiLocation()

  const [isNew, setIsNew] = React.useState(false)

  React.useEffect(() => {
    if (params?.id === 'new') {
      setIsNew(true)
    } else {
      setIsNew(false)
    }
  }, [params?.id])

  return (
    <ResizePanel
      title={isNew ? 'Создание анкеты' : 'Анкета'}
      before={<PanelHeaderBack onClick={() => router.push(routes.forms.overview.path)} />}
      {...props}
    >
      <BlankCover />

      <Group>
        <BlankTabs />
        {activeTab === BLANK_TABS.QUESTIONS && <BlankQuestions />}
        {activeTab === BLANK_TABS.ANSWERS && <BlankAnswers />}
      </Group>
    </ResizePanel>
  )
}