import { BlankForm } from "@features/blank-form"
import { routes } from "@shared/model"
import { ResizePanel } from "@shared/ui"
import { Group, NavIdProps, PanelHeaderBack } from "@vkontakte/vkui"
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"

export const BlankBuilder = (props: NavIdProps) => {

  const router = useRouteNavigator()

  return (
    <ResizePanel
      title='Создание анкеты'
      before={<PanelHeaderBack onClick={() => router.push(routes.forms.overview.path)} />}
      {...props}
    >
      <Group>
        <BlankForm />
      </Group>
    </ResizePanel>
  )
}