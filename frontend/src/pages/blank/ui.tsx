import { Group, NavIdProps, PanelHeaderBack } from "@vkontakte/vkui"
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { BlankTabs, BlankCover, BlankQuestions, BlankAnswers } from "@widgets/index"
import { BLANK_TABS, routes } from "@shared/model"
import { ResizePanel } from "@shared/ui"

export const Blank = (props: NavIdProps) => {

  const router = useRouteNavigator()
  const { tab: activeTab = BLANK_TABS.QUESTIONS } = useActiveVkuiLocation()

  return (
    <ResizePanel
      title={'Анкета'}
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